from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Role tables
ROLE_TABLES = {
    "student": "students",
    "teacher": "teachers",
    "organizer": "organizers",
    "admin": "admins",
}

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    if not username or not password or not role:
        return jsonify({"success": False, "error": "Username, password, and role are required"}), 400

    table_name = ROLE_TABLES.get(role.lower())
    if not table_name:
        return jsonify({"success": False, "error": "Invalid role"}), 400

    try:
        res = supabase.table(table_name).select("*") \
            .eq("name", username).eq("password", password).execute()

        if res.data:
            user = res.data[0]
            return jsonify({"success": True, "user": user})
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ✅ New: Fetch student details + certificates
@app.route("/api/student/<student_id>", methods=["GET"])
def get_student_dashboard(student_id):
    try:
        student_res = supabase.table("students").select("*").eq("student_id", student_id).single().execute()
        cert_res = supabase.table("certificates").select("*").eq("student_id", student_id).execute()

        return jsonify({
            "success": True,
            "student": student_res.data,
            "certificates": cert_res.data
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
@app.route("/api/events")
def get_events():
    organizer_id = request.args.get("organizer_id")
    res = supabase.table("events").select("*").eq("organizer_id", organizer_id).execute()
    return jsonify(res.data)



@app.route("/api/admin/create-user", methods=["POST"])
def create_user():
    data = request.json
    role = data.get("role")
    name = data.get("name")
    password = data.get("password")
    class_id = data.get("class_id")
    dept = data.get("dept")  # department (for teachers/students)
    club_name = data.get("club_name")  # for organizers

    if not role or not name or not password:
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    table = ROLE_TABLES.get(role.lower())
    if not table:
        return jsonify({"success": False, "error": "Invalid role"}), 400

    try:
        insert_data = {
            "name": name,
            "password": password
        }

        # Role-specific fields
        if role.lower() in ["student", "teacher"]:
            if not class_id or not dept:
                return jsonify({"success": False, "error": "class_id and dept are required for students/teachers"}), 400
            insert_data["class_id"] = int(class_id)
            insert_data["dept"] = dept

        elif role.lower() == "organizer":
            if not club_name:
                return jsonify({"success": False, "error": "club_name is required for organizers"}), 400
            insert_data["club_name"] = club_name

        res = supabase.table(table).insert(insert_data).execute()

        return jsonify({"success": True, "data": res.data})

    except Exception as e:
        print("Error creating user:", e)
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/upload-certificate", methods=["POST"])
def upload_certificate():
    try:
        files = request.files.getlist("files")  # Support multiple files
        event_id = request.form.get("event_id")
        organizer_id = request.form.get("organizer_id")

        if not files:
            return jsonify({"success": False, "message": "No files selected"}), 400
        if not event_id or not organizer_id:
            return jsonify({"success": False, "message": "Missing event_id or organizer_id"}), 400

        uploaded_files = []

        for file in files:
            if file.filename == "":
                continue

            filename = file.filename
            parts = filename.split("_")
            if len(parts) < 2 or not filename.lower().endswith(".pdf"):
                return jsonify({"success": False, "message": f"Filename '{filename}' must be STUDENTID_CLASSID_certificate.pdf"}), 400

            student_id = int(parts[0])
            class_id = int(parts[1])

            # Save file locally
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(save_path)

            # Create a publicly accessible URL
            file_url = f"http://127.0.0.1:5000/uploads/{filename}"

            # Insert into Supabase
            res = supabase.table("certificates").insert({
                "student_id": student_id,
                "event_id": event_id,
                "upload_by": organizer_id,
                "file_url": f"http://127.0.0.1:5000/uploads/{filename}"
            }).execute()

            if res.data:
                uploaded_files.append(filename)
            else:
                return jsonify({"success": False, "message": f"Database insert failed for {filename}"}), 500

        return jsonify({"success": True, "files": uploaded_files})

    except Exception as e:
        print("Upload error:", e)
        return jsonify({"success": False, "message": str(e)}), 500


# ✅ NEW: Serve uploaded files
@app.route("/uploads/<filename>")
def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/api/teacher/<teacher_id>", methods=["GET"])
def get_teacher_dashboard(teacher_id):
    try:
        # Step 1: Get teacher's class using teacher_id (not id)
        teacher_res = supabase.table("teachers").select("class_id, name").eq("teacher_id", teacher_id).single().execute()
        if not teacher_res.data:
            return jsonify({"success": False, "error": "Teacher not found"}), 404

        class_id = teacher_res.data["class_id"]

        # Step 2: Get students of that class using student_id (not id)
        students_res = supabase.table("students").select("student_id, name").eq("class_id", class_id).execute()
        student_ids = [s["student_id"] for s in students_res.data]  # Use student_id

        # Step 3: Get certificates for these students
        certs_res = supabase.table("certificates").select("*").in_("student_id", student_ids).execute()

        return jsonify({
            "success": True,
            "teacher": teacher_res.data,
            "students": students_res.data,
            "certificates": certs_res.data
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
@app.errorhandler(Exception)
def handle_exception(e):
    # Catch all unhandled exceptions and return JSON
    print("Unhandled exception:", e)
    return jsonify({"success": False, "message": str(e)}), 500






@app.route('/')
def home():
    return "Welcome to the Certification Management System Backend!"

if __name__ == '__main__':
    app.run(debug=True)

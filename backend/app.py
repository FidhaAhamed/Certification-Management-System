from flask import Flask, request, jsonify
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
    role = data.get("role")   # 'student' | 'teacher' | 'organizer'
    name = data.get("name")
    password = data.get("password")
    class_id = data.get("class_id")  # optional for students/teachers

    table = ROLE_TABLES.get(role.lower())
    if not table:
        return jsonify({"success": False, "error": "Invalid role"}), 400

    try:
        res = supabase.table(table).insert({
            "name": name,
            "password": password,
            **({"class_id": class_id} if class_id else {})
        }).execute()
        return jsonify({"success": True, "data": res.data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
@app.route("/api/upload-certificate", methods=["POST"])
def upload_certificate():
    try:
        file = request.files.get("file")
        event_id = request.form.get("event_id")
        organizer_id = request.form.get("organizer_id")

        if not file or file.filename == "":
            return jsonify({"success": False, "message": "No selected file"}), 400
        if not event_id or not organizer_id:
            return jsonify({"success": False, "message": "Missing event_id or organizer_id"}), 400

        filename = file.filename
        parts = filename.split("_")
        if len(parts) < 3 or not filename.lower().endswith(".pdf"):
            return jsonify({"success": False, "message": "Filename must be STUDENTID_CLASSID_certificate.pdf"}), 400

        student_id = int(parts[0])
        class_id = int(parts[1])
        event_id = int(event_id)
        organizer_id = int(organizer_id)

        # Ensure uploads folder exists
        UPLOAD_FOLDER = "uploads"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)

        # Insert into Supabase
        print(f"Inserting certificate: student_id={student_id}, class_id={class_id}, event_id={event_id}, organizer_id={organizer_id}")
        res = supabase.table("certificates").insert({
            "file_name": filename,
            "file_url": f"/{save_path}",  # optional: adjust to how you serve static files
            "student_id": student_id,
            "class_id": class_id,
            "event_id": event_id,
            "organizer_id": organizer_id
        }).execute()

        if res.data:
            print("Insert successful:", res.data)
            return jsonify({"success": True, "file_url": f"/{save_path}"})
        else:
            print("Insert failed:", res)
            return jsonify({"success": False, "message": "Database insert failed"}), 500

    except Exception as e:
        print("Upload error:", e)
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/api/teacher/<teacher_id>", methods=["GET"])
def get_teacher_dashboard(teacher_id):
    try:
        # Step 1: Get teacher's class
        teacher_res = supabase.table("teachers").select("class_id, name").eq("id", teacher_id).single().execute()
        if not teacher_res.data:
            return jsonify({"success": False, "error": "Teacher not found"}), 404

        class_id = teacher_res.data["class_id"]

        # Step 2: Get students of that class
        students_res = supabase.table("students").select("id, name").eq("class_id", class_id).execute()
        student_ids = [s["id"] for s in students_res.data]

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






@app.route('/')
def home():
    return "Welcome to the Certification Management System Backend!"

if __name__ == '__main__':
    app.run(debug=True)

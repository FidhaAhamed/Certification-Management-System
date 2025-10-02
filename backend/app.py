from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

# Supabase setup
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/')
def home():
    return "Certification Management System Flask backend is running!"

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    # Simplified: store user in supabase 'users' table
    res = supabase.table('users').insert({
        'email': data['email'],
        'name': data['name'],
        'role': data['role'],
        'password': data['password'] # Hash in production!
    }).execute()
    return jsonify({'success': True, 'user': res.data})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    res = supabase.table('users').select('*').eq('email', email).eq('password', password).execute()
    if res.data:
        return jsonify({'success': True, 'user': res.data[0]})
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/api/events', methods=['GET', 'POST'])
def events():
    if request.method == 'GET':
        res = supabase.table('events').select('*').execute()
        return jsonify(res.data)
    else:
        data = request.json
        res = supabase.table('events').insert(data).execute()
        return jsonify({'success': True, 'event': res.data})

@app.route('/api/certificates/upload', methods=['POST'])
def upload_certificate():
    # Simplified: expects event_id, student_id, file_url
    data = request.json
    res = supabase.table('certificates').insert(data).execute()
    return jsonify({'success': True, 'certificate': res.data})

@app.route('/api/certificates/<user_id>', methods=['GET'])
def get_certificates(user_id):
    res = supabase.table('certificates').select('*').eq('student_id', user_id).execute()
    return jsonify(res.data)

if __name__ == '__main__':
    app.run(debug=True)
    
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    # Validate input (basic)
    required = ['email', 'name', 'role', 'password']
    if not all(field in data and data[field] for field in required):
        return jsonify({'success': False, 'error': 'Missing fields'}), 400

    # Check if user already exists
    existing = supabase.table('users').select('id').eq('email', data['email']).execute()
    if existing.data:
        return jsonify({'success': False, 'error': 'User already exists'}), 400

    # Insert user (NOTE: hash password for real apps!)
    res = supabase.table('users').insert({
        'email': data['email'],
        'name': data['name'],
        'role': data['role'],
        'password': data['password']
    }).execute()

    return jsonify({'success': True, 'user': res.data})    
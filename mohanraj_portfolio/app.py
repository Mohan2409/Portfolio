import os
from flask import Flask, render_template, abort, url_for
from datetime import datetime

app = Flask(__name__)

# -----------------------------
# Data powered by Python
# -----------------------------

experience = [
    {
        "id": "vapt-intern",
        "title": "Cybersecurity Researcher Intern",
        "org": "Necurity Solutions Network Security Private Ltd",
        "meta": "VAPT · Firewalls · Network Security · IT Support · System Admin",
        "short": (
            "Gained hands-on experience with professional tools, supported in incident analysis and remediation activities"
        ),
        "image": "img/necurity_cert.pdf",
        "highlights": [
            "Observed and assisted with basic Vulnerability Assessment & Penetration Testing activities across internal systems and applications.",
            "Learned how firewalls are configured, monitored, and audited for security compliance and access control.",
            "Supported patch management tasks and participated in routine security policy verification.",
            "Gained foundational experience in log analysis, alert review, and initial incident triage processes.",
            "Understood the workflow, collaboration practices, and operational culture of a security-focused IT environment.",
        ],
        "tech": ["Team Management", "VAPT", "Communication", "Leadership", "Client Handling", "System Administrator"],
    },
    {
        "id": "cybersecurity-intern",
        "title": "Cybersecurity Intern [Foundation - Systems]",
        "org": "Prodapt Solutions Pvt Ltd",
        "meta": "VAPT · Firewalls · Network Security",
        "short": (
            "Hands-on exposure to vulnerability assessment, firewall concepts, "
            "and network security in a real IT environment."
        ),
        "image": "img/cyber_intern_cert.pdf",
        "highlights": [
            "Observed basic Vulnerability Assessment & Penetration Testing activities.",
            "Learned how firewalls are configured, monitored, and audited.",
            "Worked with basic patch management and security policy checks.",
            "Gained understanding of log analysis and incident triage thinking.",
            "Experienced the culture and workflow inside a security-focused IT team.",
        ],
        "tech": ["VAPT (concepts)", "Firewalls", "Network Security", "Windows / Linux"],
    },
    {
        "id": "zivaaria-fullstack-intern",
        "title": "Full Stack Java Intern",
        "org": "Zivaaria Tech Solutions",
        "meta": "Android App Development · Java · MySQL",
        "short": (
            "Developed an Android application using Java and MySQL, learning "
            "full-stack workflows and client-driven development."
        ),
        # PDF will be embedded in detail page
        "image": "img/zivaaria_cert.pdf",
        "highlights": [
            "Built the front-end screens of an Android application using Java.",
            "Integrated MySQL as the back-end data store for the app.",
            "Worked with SQL queries, CRUD operations, and relational schemas.",
            "Collaborated with the team to understand requirements and convert them into features.",
            "Got exposure to debugging, testing, and improving performance of the app.",
        ],
        "tech": ["Java", "Android", "MySQL", "OOPS", "Git (basic)"],
    },
]

projects = [
    {
        "id": "automated-call-monitoring",
        "name": "Automated Corporate Call Monitoring",
        "meta": "Final Year Project · Python · Deep Learning · Regex · Twilio",
        "short": "End-to-end pipeline to detect sensitive data leakage in recorded calls.",
        "description": (
            "Designed and implemented a complete pipeline for detecting sensitive data "
            "leakage in corporate call recordings. The system uploads call audio, converts "
            "it to text, scans for sensitive patterns, and triggers alerts when needed."
        ),
        "highlights": [
            "Automatic upload of call recordings from Android to a backend server.",
            "Speech-to-text conversion pipeline for recorded audio.",
            "Regex-based detection for high-confidence patterns like phone numbers, card numbers, etc.",
            "Electra-based deep learning model for contextual sensitive data detection when regex is not enough.",
            "Twilio SMS alerts with summarized details when potential data theft is detected.",
        ],
        "tech": ["Python", "Flask", "Regex", "NLP / Electra", "Twilio", "Linux"],
        "github": "https://github.com/Mohan2409/Automated-Corporate-Call-Monitoring-for-Sensitive-Data-Protection"
    },
    {
        "id": "secure-call-upload",
        "name": "Secure Call Recording & Upload App",
        "meta": "Android · Flask Backend · Secure Upload",
        "short": "Customized call recorder with secure upload flow for further analysis.",
        "description": (
            "Modified an open-source Android call recorder to reliably capture calls and securely "
            "upload them to a backend. Focused on reducing latency, avoiding congestion, and "
            "ensuring stable upload for large audio files."
        ),
        "highlights": [
            "Integrated recording logic with a custom upload endpoint.",
            "Implemented retry and basic error handling for flaky network conditions.",
            "Ensured recordings were organized and tagged for later processing.",
        ],
        "tech": ["Android", "HTTP APIs", "Flask", "File Handling", "Security (basic)"],
        "github": "https://github.com/Mohan2409/Automated-Corporate-Call-Monitoring-for-Sensitive-Data-Protection"
    },
    {
        "id": "port-scanner",
        "name": "Open Port Scanner & Web Service Discovery Tool",
        "meta": "Python · Flask · Networking · Automation · Concurrent Scanning",
        "short": "A multi-threaded port scanning and web-service discovery tool built using Python and Flask.",
        "description": (
            "Developed a high-performance network scanning application capable of identifying active IPs, detecting open web-related ports, and providing real-time feedback through server-sent events (SSE). "
            "The tool supports CIDR ranges, dash-notation subnets, CSV inputs, and manual IP lists, making it usable for both small and enterprise-scale scanning tasks. "
            "It includes a built-in Flask UI for launching scans, monitoring progress, viewing live discoveries, and exporting results."
        ),
        "highlights": [
            "Implemented ICMP ping validation to avoid scanning inactive hosts and reduce network noise.",
            "Built a concurrent port-scanning engine with Python sockets and ThreadPoolExecutor logic.",
            "Implemented robust parsing for CSV files, CIDR ranges, dash-based ranges, and manual IPs.",
        ],
        "tech": ["Python", "Flask", "Network Tools", "Real-time Updates via Server-Sent Events (SSE)"],
        "github": "https://github.com/Mohan2409/ipscanner"
    },
]

skills = {
    "Technical Skills": [
        "C Programming",
        "Java (Full Stack basics)",
        "Python (Scripting, Flask)",
        "SQL & MySQL",
        "Linux & Command Line",
        "VAPT Concepts",
        "Network & Endpoint Security (basics)",
        "Patch Management & Security Audits",
    ],
    "Tools": [
        "Kali Linux",
        "Tennable Nessus",
        "Burp Suite",
        "NetExec",
        "Wireshark",
        "Hashcat",
        "Metasploit",
        "Nmap",
    ],
    "Soft Skills": [
        "Communication & Public Speaking",
        "Leadership & Team Coordination",
        "Event Management & Planning",
        "Time Management under pressure",
        "Client & Customer Interaction",
    ],
}

achievements = [
    "Conducted multiple successful community events as a Rotaractor.",
    "Won prizes through Crescent Team Dramatics in intra-college events.",
    "Ran a profitable shop at the Becrez entrepreneurship festival conducted by CIIC.",
    "Delivered a deep learning–based security project as a final-year solution.",
]

stats = [
    {
        "label": "Security / Infra Projects",
        "value": "4+",
        "sub": "Call monitoring, infrastructure.",
    },
    {
        "label": "Domains",
        "value": "3",
        "sub": "Security · Infra · Admin",
    },
    {
        "label": "Events & Activities",
        "value": "25+",
        "sub": "Rotaract, dramatics, fests",
    },
]

education = [
    {
        "degree": "Bachelor of Technology",
        "focus": "CSE (Cyber Security)",
        "inst": "B.S. Abdur Rahman Crescent Institute of Science and Technology",
        "years": "2021 – 2025",
        "location": "Chennai, Tamil Nadu, India",
    },
    {
        "degree": "Higher Secondary (Computer Science Stream)",
        "focus": "Computer Science with PCM",
        "inst": "Petit Seminaire Higher Secondary School",
        "years": "2009 – 2021",
        "location": "Puducherry, India",
    },
]

certifications = [
    {
        "id": "crta-cert",
        "title": "Certified Red Team Analyst [CRTA]",
        "issuer": "By Cyberwarfare",
        "when": "2025",
        "desc": "Certified security enthusiast with real-world exposure to Red Teaming techniques in Active Directory environments.",
        "image": "img/crta_cert.pdf",
        "details": [
            "Gained hands-on experience by performing Red Team operations in Active Directory (AD) environments, including reconnaissance, misconfiguration identification, and attack path analysis.",
            "Applied offensive security techniques such as credential access, privilege escalation, lateral movement, and post-exploitation analysis to understand real-world AD attack scenarios.",
            "Developed a strong understanding of defensive gaps and detection opportunities by mapping attacks to security controls, strengthening my ability to assess and improve enterprise security posture.",
        ],
    },
    {
        "id": "bec-cert",
        "title": "Business English Certificate",
        "issuer": "By Cambridge English",
        "when": "2023",
        "desc": "International certification demonstrating proficiency in workplace English, awarded by Cambridge English.",
        "image": "img/bec_cert.jpg",
        "details": [
            "Certified competency in business communication, presentations, and workplace interactions.",
            "Enhanced overall fluency, listening comprehension, and confidence in formal business environments."
        ],
    },
]

socials = {
    "email": "mnrk2435@gmail.com",
    "phone": "+91 90256 81651",
    "linkedin": "https://www.linkedin.com/in/mohanraj-k-37960228a/",
    "github": "https://github.com/Mohan2409",
    "youtube": "https://www.youtube.com/@RyumaStreams",
    "instagram": "https://www.instagram.com/ryuma_streams",
}


def find_by_id(collection, item_id):
    for item in collection:
        if item["id"] == item_id:
            return item
    return None


@app.route("/")
def home():
    return render_template(
        "index.html",
        year=datetime.now().year,
        experience=experience,
        projects=projects,
        skills=skills,
        achievements=achievements,
        stats=stats,
        education=education,
        certifications=certifications,
        socials=socials,
    )

from flask import request, jsonify

@app.route("/contact", methods=["POST"])
def contact_submit():
    name = request.form.get("name")
    email = request.form.get("email")
    phone = request.form.get("phone")
    message = request.form.get("message")

    # ✅ For now: just log it (later we can send email / save DB)
    print("New Contact Submission")
    print("Name:", name)
    print("Email:", email)
    print("Phone:", phone)
    print("Message:", message)
    print("-----------------------")

    return jsonify({"status": "success"})



@app.route("/experience/<exp_id>")
def experience_detail(exp_id):
    item = find_by_id(experience, exp_id)
    if not item:
        abort(404)
    return render_template("detail_experience.html", item=item, socials=socials, year=datetime.now().year)


@app.route("/project/<proj_id>")
def project_detail(proj_id):
    item = find_by_id(projects, proj_id)
    if not item:
        abort(404)
    return render_template("detail_project.html", item=item, socials=socials, year=datetime.now().year)


@app.route("/certification/<cert_id>")
def certification_detail(cert_id):
    item = find_by_id(certifications, cert_id)
    if not item:
        abort(404)
    return render_template("detail_certification.html", item=item, socials=socials, year=datetime.now().year)


# Simple resume download (just opens the PDF)
@app.route("/resume")
def resume():
    # redirect to static PDF
    return "", 302, {"Location": url_for("static", filename="img/docs/Mohanraj_K_Resume.pdf")}


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
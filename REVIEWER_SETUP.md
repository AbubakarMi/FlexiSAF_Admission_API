# FlexiSAF Admissions - Reviewer Account Setup

## Quick Start

### Create Reviewer Account

1. Open PowerShell in the `backend` folder
2. Run: `.\run_create_reviewer.ps1`

This will create a reviewer account directly in the database.

### Login Credentials

**Reviewer Dashboard:**
- Email: `reviewer@flexisaf.com`
- Password: `admin123`

**Student Account (Existing):**
- Email: `abubakarmi131@gmail.com`
- Password: (your password)

---

## Dashboard Features

### Sidebar Navigation
- **Dashboard** - Overview with statistics and charts
- **All Applicants** - List of all student applications
- **Review** - Review and evaluate applications
- **Admitted** - View accepted students

### Statistics & Charts
- Total applications count
- Pending, In Review, Accepted counts
- Average GPA, Test Scores, AI Scores
- Status distribution progress bars
- Recent applications list

### Actions Available
- Review individual applications
- Change application status (Pending/In Review/Accepted/Rejected)
- Add reviewer notes
- View AI recommendations
- Export to PDF/CSV
- Compare multiple applicants

---

## Email Notifications

Emails are automatically sent when:
- Student submits application (confirmation email)
- Status changes to Accepted (congratulations email)
- Status changes to Rejected (notification email)
- Any other status change (update email)

**Email API:** Resend (configured in application.yml)

---

## System Notes

- Frontend runs on: http://localhost:5173
- Backend runs on: http://localhost:8080
- Database: PostgreSQL on localhost:5432
- Database name: Admission_Db

---

## Troubleshooting

If login fails:
1. Ensure PostgreSQL is running
2. Run the `run_create_reviewer.ps1` script
3. Check database connection in application.yml
4. Verify backend is running on port 8080

---

Built with Spring Boot 3.2.0 & React 18

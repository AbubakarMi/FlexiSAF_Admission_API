# Authentication System Guide

## Overview

The FlexiSAF Admissions System now features a complete authentication system with role-based access control. Users can register as students, log in, and submit applications through a secured workflow.

---

## User Roles

### 1. **STUDENT**
- Can register through the public registration page
- Can log in and submit applications
- Access to `/submit-application` route only

### 2. **REVIEWER**
- Pre-created accounts (managed by admins)
- Can log in and access the dashboard
- Can view, review, and update applicant statuses
- Access to `/dashboard` and `/applicants/:id` routes

### 3. **ADMIN**
- Full system access
- Can manage all applicants and users
- Default account: `admin@flexisaf.com` / `admin123`

---

## User Flows

### Student Flow

1. **Registration** (`/register`)
   - Fill in: Username, Email, Password, First Name, Last Name
   - Validation: Username (min 3 chars), Email (valid format), Password (min 6 chars)
   - Auto-assigned STUDENT role
   - Redirects to login after successful registration

2. **Login** (`/login`)
   - Enter registered email and password
   - Receives JWT token (24-hour validity)
   - Redirects to `/submit-application`

3. **Submit Application** (`/submit-application`)
   - Authenticated page (requires login)
   - Fill in academic details: First Name, Last Name, Email, Program, GPA, Test Score
   - AI automatically evaluates the application
   - Can submit multiple applications

4. **Logout**
   - Click logout button in header
   - JWT token cleared
   - Redirected to login page

### Reviewer/Admin Flow

1. **Login** (`/login`)
   - Use provided credentials
   - Receives JWT token
   - Redirects to `/dashboard`

2. **Dashboard** (`/dashboard`)
   - View all applicants
   - Search and filter
   - Pagination support
   - Click applicant to view details

3. **Applicant Details** (`/applicants/:id`)
   - View full applicant information
   - See AI evaluation and score
   - Update application status
   - Add reviewer notes

---

## API Endpoints

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "role": "STUDENT",
  "message": "Registration successful! You can now log in."
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securepass123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "email": "john.doe@example.com",
  "username": "john_doe",
  "role": "STUDENT"
}
```

### Protected Endpoints

All applicant management endpoints require JWT authentication:

```
GET /api/applicants
POST /api/applicants
GET /api/applicants/{id}
PUT /api/applicants/{id}
DELETE /api/applicants/{id}

Headers:
Authorization: Bearer <JWT_TOKEN>
```

**Exception:** Creating an applicant (POST /api/applicants) is now authenticated - students must be logged in.

---

## Frontend Routes

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with CTAs |
| `/register` | Register | Student registration form |
| `/login` | Login | Login for all users |

### Protected Routes (Requires Authentication)

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/submit-application` | SubmitApplication | STUDENT | Application submission form |
| `/dashboard` | Dashboard | REVIEWER, ADMIN | Applicant management dashboard |
| `/applicants/:id` | ApplicantDetails | REVIEWER, ADMIN | Detailed applicant view |

---

## Security Features

### Backend Security

1. **Password Encryption**
   - BCrypt hashing with salt
   - Minimum 6 characters required

2. **JWT Token**
   - 24-hour expiration
   - HS512 algorithm
   - Stateless authentication

3. **Role-Based Access**
   - Enum-based roles (STUDENT, REVIEWER, ADMIN)
   - Security configured per endpoint

4. **Input Validation**
   - Jakarta Validation (@Valid)
   - Email format validation
   - Username uniqueness check

5. **CORS Configuration**
   - Allowed origins: localhost:3000, localhost:5173
   - Credentials support enabled

### Frontend Security

1. **JWT Storage**
   - Stored in localStorage
   - Included in all API requests via Axios interceptor

2. **Auto-Redirect**
   - 401 errors → login page
   - JWT expiration → login page

3. **Protected Routes**
   - PrivateRoute component checks authentication
   - Redirects unauthenticated users to login

4. **Role-Based Routing**
   - Students → `/submit-application`
   - Reviewers/Admins → `/dashboard`

---

## Design System (No Gradients)

### Color Palette

```css
Primary: #1E3A8A (Deep Blue)
Success: #10B981 (Emerald Green)
Warning: #F59E0B (Amber)
Danger: #EF4444 (Red)
Background: #F3F4F6 (Light Gray)
Text: #111827 (Almost Black)
```

### Design Principles

1. **Clean & Modern**
   - No gradients (solid colors only)
   - Sharp rounded corners (rounded-lg, rounded-xl, rounded-2xl)
   - Generous white space

2. **Visual Hierarchy**
   - Large, bold headings (text-4xl, text-5xl)
   - Section separators with colored bars
   - Clear card-based layouts

3. **Professional Icons**
   - SVG icons from Heroicons
   - Consistent sizing and spacing
   - Semantic use (lock for security, user for profile, etc.)

4. **Smooth Interactions**
   - Hover effects on buttons
   - Focus states for inputs
   - Loading spinners
   - Transition animations

5. **Responsive Design**
   - Mobile-first approach
   - Grid layouts for forms
   - Flexible containers

---

## Default Credentials

### Admin Account
```
Email: admin@flexisaf.com
Password: admin123
Role: ADMIN
```

This account is created automatically via database migration.

---

## Testing the System

### 1. Test Student Registration

1. Start the application
2. Navigate to http://localhost:3000
3. Click "Get Started" or "Register Now"
4. Fill in registration form:
   - Username: `test_student`
   - Email: `student@test.com`
   - Password: `test123`
   - First Name: `Test`
   - Last Name: `Student`
5. Click "Create Account"
6. Should redirect to login page

### 2. Test Student Login

1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: `student@test.com`
   - Password: `test123`
3. Click "Sign In"
4. Should redirect to `/submit-application`

### 3. Test Application Submission

1. After student login, fill in application form:
   - First Name: `Test`
   - Last Name: `Student`
   - Email: `student@test.com`
   - Program: `Computer Science`
   - GPA: `3.8`
   - Test Score: `85`
2. Click "Submit Application"
3. Should see success message with AI evaluation

### 4. Test Reviewer Access

1. Logout (click logout button)
2. Login with admin credentials:
   - Email: `admin@flexisaf.com`
   - Password: `admin123`
3. Should redirect to `/dashboard`
4. See submitted application in the table
5. Click on applicant to view details
6. See AI score and recommendations

---

## Troubleshooting

### Issue: "Email already registered"
**Solution:** Use a different email or check if you already have an account

### Issue: "Login failed. Please check your credentials."
**Solution:**
- Verify email and password are correct
- Check caps lock is off
- Ensure you've registered first

### Issue: Redirected to login after submitting application
**Solution:** JWT token may have expired (24 hours). Log in again.

### Issue: Can't access dashboard as student
**Solution:** Dashboard is only for REVIEWER and ADMIN roles. Students should use `/submit-application`

### Issue: 401 Unauthorized errors
**Solution:**
- Clear browser localStorage
- Log out and log back in
- Check if backend is running on port 8080

---

## Architecture

### Backend Structure

```
src/main/java/com/flexisaf/admissions/
├── controller/
│   └── AuthController.java (register, login)
├── service/
│   └── AuthService.java (registration logic, authentication)
├── dto/
│   ├── RegisterRequest.java
│   ├── RegisterResponse.java
│   ├── LoginRequest.java
│   └── LoginResponse.java
├── entity/
│   └── User.java (STUDENT, REVIEWER, ADMIN roles)
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
└── config/
    ├── SecurityConfig.java
    └── CorsConfig.java
```

### Frontend Structure

```
src/
├── pages/
│   ├── Home.jsx (landing page)
│   ├── Register.jsx (registration form)
│   ├── Login.jsx (login form)
│   ├── SubmitApplication.jsx (authenticated application form)
│   ├── Dashboard.jsx (reviewer dashboard)
│   └── ApplicantDetails.jsx (applicant details)
├── context/
│   └── AuthContext.jsx (authentication state management)
├── services/
│   ├── api.js (Axios with JWT interceptor)
│   └── authService.js
└── components/
    └── PrivateRoute.jsx (route protection)
```

---

## API Documentation

Access Swagger UI at: **http://localhost:8080/swagger-ui.html**

All endpoints are documented with request/response schemas.

---

## Future Enhancements

1. **Email Verification**
   - Send verification email on registration
   - Verify email before allowing login

2. **Password Reset**
   - Forgot password functionality
   - Reset via email link

3. **User Profile**
   - View and edit profile
   - Change password

4. **Application History**
   - Students can view their submitted applications
   - Track application status

5. **Admin User Management**
   - Create reviewer accounts
   - Manage user roles
   - Deactivate accounts

6. **Two-Factor Authentication**
   - Enhanced security for admin accounts

---

## Summary

The authentication system is now fully functional with:

✅ Student registration
✅ Role-based login (STUDENT, REVIEWER, ADMIN)
✅ JWT authentication
✅ Protected routes
✅ World-class UI design (no gradients)
✅ Secure password storage
✅ Auto-redirect based on role
✅ Comprehensive error handling

All users can now register, log in, and access features based on their roles!

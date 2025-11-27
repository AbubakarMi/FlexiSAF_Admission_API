package com.flexisaf.admissions.service;

import com.flexisaf.admissions.entity.Applicant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${resend.from.email:onboarding@resend.dev}")
    private String fromEmail;

    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final RestTemplate restTemplate;

    public EmailService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Send email notification to applicant when their status changes
     */
    public void sendStatusChangeEmail(Applicant applicant, String newStatus) {
        try {
            String subject = "Application Status Update - FlexiSAF Admissions";
            String htmlContent = buildStatusChangeEmailContent(applicant, newStatus);

            sendEmail(applicant.getEmail(), subject, htmlContent);
            logger.info("Status change email sent to: {}", applicant.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send status change email to: {}", applicant.getEmail(), e);
        }
    }

    /**
     * Send acceptance email to applicant
     */
    public void sendAcceptanceEmail(Applicant applicant) {
        try {
            String subject = "Congratulations! You've been accepted - FlexiSAF Admissions";
            String htmlContent = buildAcceptanceEmailContent(applicant);

            sendEmail(applicant.getEmail(), subject, htmlContent);
            logger.info("Acceptance email sent to: {}", applicant.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send acceptance email to: {}", applicant.getEmail(), e);
        }
    }

    /**
     * Send rejection email to applicant
     */
    public void sendRejectionEmail(Applicant applicant) {
        try {
            String subject = "Application Status Update - FlexiSAF Admissions";
            String htmlContent = buildRejectionEmailContent(applicant);

            sendEmail(applicant.getEmail(), subject, htmlContent);
            logger.info("Rejection email sent to: {}", applicant.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send rejection email to: {}", applicant.getEmail(), e);
        }
    }

    /**
     * Send application received confirmation email
     */
    public void sendApplicationReceivedEmail(Applicant applicant) {
        try {
            String subject = "Application Received - FlexiSAF Admissions";
            String htmlContent = buildApplicationReceivedContent(applicant);

            sendEmail(applicant.getEmail(), subject, htmlContent);
            logger.info("Application received email sent to: {}", applicant.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send application received email to: {}", applicant.getEmail(), e);
        }
    }

    /**
     * Send email using Resend API
     */
    private void sendEmail(String toEmail, String subject, String htmlContent) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        Map<String, Object> emailRequest = new HashMap<>();
        emailRequest.put("from", fromEmail);
        emailRequest.put("to", new String[]{toEmail});
        emailRequest.put("subject", subject);
        emailRequest.put("html", htmlContent);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(emailRequest, headers);

        restTemplate.exchange(RESEND_API_URL, HttpMethod.POST, request, String.class);
    }

    private String buildStatusChangeEmailContent(Applicant applicant, String newStatus) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .status-badge { display: inline-block; padding: 10px 20px; background: #667eea; color: white; border-radius: 20px; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>FlexiSAF Admissions</h1>
                        <p>Application Status Update</p>
                    </div>
                    <div class="content">
                        <h2>Dear %s %s,</h2>
                        <p>Your application status has been updated.</p>
                        <p><strong>Program:</strong> %s</p>
                        <p><strong>New Status:</strong> <span class="status-badge">%s</span></p>
                        <p>You can log in to your student portal to view more details about your application.</p>
                        <p>If you have any questions, please don't hesitate to contact our admissions office.</p>
                        <p>Best regards,<br>FlexiSAF Admissions Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 FlexiSAF. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, applicant.getFirstName(), applicant.getLastName(), applicant.getProgram(), newStatus.toUpperCase());
    }

    private String buildAcceptanceEmailContent(Applicant applicant) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #11998e 0%%, #38ef7d 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .celebration { font-size: 48px; text-align: center; margin: 20px 0; }
                    .highlight { background: #38ef7d; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Congratulations! 🎉</h1>
                        <p>FlexiSAF Admissions</p>
                    </div>
                    <div class="content">
                        <div class="celebration">🎓</div>
                        <h2>Dear %s %s,</h2>
                        <p>We are delighted to inform you that you have been <strong>ACCEPTED</strong> to FlexiSAF!</p>
                        <div class="highlight">
                            <p><strong>Program:</strong> %s</p>
                            <p><strong>GPA:</strong> %.2f / 5.0</p>
                            <p><strong>Test Score:</strong> %d / 100</p>
                        </div>
                        <p>Your application stood out among many qualified candidates. We were impressed by your academic achievements and potential.</p>
                        <h3>Next Steps:</h3>
                        <ol>
                            <li>Log in to your student portal for detailed enrollment information</li>
                            <li>Review the enrollment guidelines and deadlines</li>
                            <li>Complete the enrollment process within the specified timeframe</li>
                        </ol>
                        <p>Welcome to the FlexiSAF community! We look forward to seeing you on campus.</p>
                        <p>Warmest congratulations,<br>FlexiSAF Admissions Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 FlexiSAF. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, applicant.getFirstName(), applicant.getLastName(), applicant.getProgram(),
                applicant.getGpa(), applicant.getTestScore());
    }

    private String buildRejectionEmailContent(Applicant applicant) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>FlexiSAF Admissions</h1>
                        <p>Application Status Update</p>
                    </div>
                    <div class="content">
                        <h2>Dear %s %s,</h2>
                        <p>Thank you for your interest in FlexiSAF and for taking the time to apply to our %s program.</p>
                        <p>After careful consideration of all applications, we regret to inform you that we are unable to offer you admission at this time.</p>
                        <p>This decision was difficult, as we received many applications from qualified candidates. We encourage you to continue pursuing your educational goals.</p>
                        <p>We wish you the best in your future academic endeavors.</p>
                        <p>Sincerely,<br>FlexiSAF Admissions Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 FlexiSAF. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, applicant.getFirstName(), applicant.getLastName(), applicant.getProgram());
    }

    private String buildApplicationReceivedContent(Applicant applicant) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>FlexiSAF Admissions</h1>
                        <p>Application Received</p>
                    </div>
                    <div class="content">
                        <h2>Dear %s %s,</h2>
                        <p>Thank you for submitting your application to FlexiSAF!</p>
                        <div class="info-box">
                            <p><strong>Application Details:</strong></p>
                            <p><strong>Program:</strong> %s</p>
                            <p><strong>GPA:</strong> %.2f / 5.0</p>
                            <p><strong>Test Score:</strong> %d / 100</p>
                        </div>
                        <p>Your application is now under review by our admissions committee. We will carefully evaluate all aspects of your application.</p>
                        <p>You can log in to your student portal at any time to check the status of your application.</p>
                        <p><strong>What happens next?</strong></p>
                        <ul>
                            <li>Our admissions team will review your application</li>
                            <li>You'll receive email notifications about any status changes</li>
                            <li>Final decisions are typically made within 2-4 weeks</li>
                        </ul>
                        <p>If you have any questions, please don't hesitate to contact us.</p>
                        <p>Best regards,<br>FlexiSAF Admissions Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 FlexiSAF. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, applicant.getFirstName(), applicant.getLastName(), applicant.getProgram(),
                applicant.getGpa(), applicant.getTestScore());
    }
}

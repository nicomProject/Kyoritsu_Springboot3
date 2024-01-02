package com.enicom.board.kyoritsu.config;

import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class EmailConfiguration {
    // field 정의
    private static final ExecutorService executorService = Executors.newFixedThreadPool(10);

    // Email 전송 비동기 호출
    public static void sendEmailAsync(String toEmail, String answerContent) {
        executorService.submit(() -> {
            sendMail(toEmail, answerContent);
        });
    }

    // mail 전송 함수
    private static void sendMail(String toEmail, String answer_content) {

        String _email = "nicom7708@gmail.com";
        String _password = "lnqvzqvqgckroyqo";

        String subject = "안녕하세요. 교리츠 인사담당자입니다.";
        String fromMail = "jjg@enicom.co.kr";
        String fromName = "교리츠 인사담당자";

        // mail contents
        StringBuffer contents = new StringBuffer();
        contents.append("<p>채용 공고 지원 결과 확인 부탁드립니다.</p><br>");
        contents.append(answer_content);

        // mail properties
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com"); // use Gmail
        props.put("mail.smtp.port", "587"); // set port

        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true"); // use TLS

        Session mailSession = Session.getInstance(props,
                new javax.mail.Authenticator() { // set authenticator
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(_email, _password);
                    }
                });

        try {
            MimeMessage message = new MimeMessage(mailSession);

            message.setFrom(new InternetAddress(fromMail, MimeUtility.encodeText(fromName, "UTF-8", "B"))); // 한글의 경우 encoding 필요
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(toEmail)
            );
            message.setSubject(subject);
            message.setContent(contents.toString(), "text/html;charset=UTF-8"); // 내용 설정 (HTML 형식)
            message.setSentDate(new java.util.Date());

            Transport t = mailSession.getTransport("smtp");
            t.connect(_email, _password);
            t.sendMessage(message, message.getAllRecipients());
            t.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

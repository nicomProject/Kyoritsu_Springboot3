package com.enicom.board.kyoritsu.config;

import com.enicom.board.kyoritsu.api.param.ContactParam;

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
    public static void sendEmailAsync(String toEmail, String answer, String type) {
        StringBuffer contents = new StringBuffer();
        String[] answerContent = answer.split("\n");

        if (type == "apply") {
            contents.append("<p>Kyoritsu에 지원해 주셔서 감사합니다.</p>");
            contents.append("<p>지원서 접수 완료를 알려드립니다.</p>");
            contents.append("<p>지원 결과는 해당 메일을 통해 전달될 예정입니다.</p>");
        } else if (type == "add") {
            contents.append("<p>Kyoritsu에 지원해 주셔서 감사합니다.</p>");
            contents.append("<p>채용 공고 지원 결과에 대해 안내드립니다.</p>");
            contents.append("<br>");
            contents.append("<p>===============[본문]===============</p>");
        } else if (type == "inquiry") {
            contents.append("<p>Kyoritsu 채용 문의 답변이 등록되었습니다.</p>");
            contents.append("<p>채용 문의 답변 내용 확인 부탁드립니다.</p>");
        }

        contents.append("<br>");
        for (String ac : answerContent) {
            contents.append("<p>"+ac+"</p>");
        }
        
        executorService.submit(() -> {
            sendMail(toEmail, contents);
        });
    }

    // mail 전송 함수
    private static void sendMail(String toEmail, StringBuffer contents) {
        String _email = "nicom7708@gmail.com";
        String _password = "lnqvzqvqgckroyqo";

        String subject = "안녕하세요. 교리츠 인사담당자입니다.";
        String fromMail = "jjg@enicom.co.kr";
        String fromName = "교리츠 인사담당자";

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
            // mail contents
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

    public static void sendEmailContact(ContactParam param) {
        StringBuffer contents = new StringBuffer();
        var FacilityTotal = "";
         if(param.getTextFacility() == null) {
             FacilityTotal = param.getSelectedFacility();
         } else if(param.getSelectedFacility() == null){
             FacilityTotal = param.getTextFacility();
         } else if(param.getSelectedFacility() != null && param.getTextFacility() != null){
             FacilityTotal = param.getSelectedFacility() + " " + param.getTextFacility();
         }

            contents.append("<p>교리츠 홈페이지 문의사항</p>");
            contents.append("<p>접수된 문의사항 내용을 알려드립니다.</p>");
            contents.append("<p>문의 이메일 : ").append(param.getTextEmail()).append("</p>");
            contents.append("<p>카테고리 : ").append(param.getSelectedCategory()).append("</p>");
            contents.append("<p>시설명 : ").append(FacilityTotal).append("</p>");
            contents.append("<p>문의 내용 : ").append(param.getTextQuestion()).append("</p>");
            executorService.submit(() -> {
                sendMailContact(contents);
            });
    }

    private static void sendMailContact(StringBuffer contents) {
        String _email = "nicom7708@gmail.com";
        String _password = "lnqvzqvqgckroyqo";

        String subject = "교리츠 문의사항입니다.";
        String fromMail = "jjg@enicom.co.kr";
        String fromName = "교리츠";

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
            // mail contents
            message.setFrom(new InternetAddress(fromMail, MimeUtility.encodeText(fromName, "UTF-8", "B"))); // 한글의 경우 encoding 필요
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse("leaft7708@naver.com")
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

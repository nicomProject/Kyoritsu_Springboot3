--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: mn_access_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mn_access_log (
    login_result integer,
    login_date timestamp(6) without time zone,
    rec_key bigint NOT NULL,
    login_id character varying(20),
    login_ip character varying(20)
);


ALTER TABLE public.mn_access_log OWNER TO postgres;

--
-- Name: COLUMN mn_access_log.login_result; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_access_log.login_result IS '로그인 성공 여부 {1: 성공, 0: 실패}';


--
-- Name: mn_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mn_menu (
    order_seq integer,
    use_yn integer,
    create_date timestamp(6) without time zone,
    edit_date timestamp(6) without time zone,
    code character varying(20) NOT NULL,
    group_id character varying(20),
    name character varying(20),
    create_user character varying(50),
    edit_user character varying(50),
    url character varying(100),
    code_detail character varying(255),
    edit_role character varying(255),
    icon character varying(255),
    read_role character varying(255),
    target character varying(255),
    CONSTRAINT mn_menu_code_check CHECK (((code)::text = ANY ((ARRAY['INTRODUCTIONS'::character varying, 'NOTICES'::character varying, 'JOBS'::character varying, 'APPLICANTS'::character varying, 'INQUIRES'::character varying, 'ACCOUNTS'::character varying, 'ACCESS'::character varying])::text[]))),
    CONSTRAINT mn_menu_edit_role_check CHECK (((edit_role)::text = ANY ((ARRAY['ADMIN'::character varying, 'SYSTEM'::character varying])::text[]))),
    CONSTRAINT mn_menu_read_role_check CHECK (((read_role)::text = ANY ((ARRAY['ADMIN'::character varying, 'SYSTEM'::character varying])::text[]))),
    CONSTRAINT mn_menu_target_check CHECK (((target)::text = ANY ((ARRAY['SELF'::character varying, 'blank'::character varying])::text[])))
);


ALTER TABLE public.mn_menu OWNER TO postgres;

--
-- Name: COLUMN mn_menu.order_seq; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.order_seq IS '메뉴 보여질 순서 설정 - 오름차순 정렬';


--
-- Name: COLUMN mn_menu.code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.code IS '메뉴 코드';


--
-- Name: COLUMN mn_menu.group_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.group_id IS '메뉴 그룹';


--
-- Name: COLUMN mn_menu.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.name IS '메뉴명';


--
-- Name: COLUMN mn_menu.url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.url IS '메뉴 URL';


--
-- Name: COLUMN mn_menu.code_detail; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.code_detail IS '메뉴 상세 코드';


--
-- Name: COLUMN mn_menu.edit_role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.edit_role IS '권한 - 수정 권한';


--
-- Name: COLUMN mn_menu.icon; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.icon IS '아이콘 Class - FontAwesome';


--
-- Name: COLUMN mn_menu.read_role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.read_role IS '권한 - 조회 권한';


--
-- Name: COLUMN mn_menu.target; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu.target IS '새창 여부 - {SELF: 사용 안함, BLANK: 사용함}';


--
-- Name: mn_menu_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mn_menu_group (
    order_seq integer,
    use_yn integer,
    create_date timestamp(6) without time zone,
    edit_date timestamp(6) without time zone,
    code character varying(20) NOT NULL,
    name character varying(20),
    create_user character varying(50),
    edit_user character varying(50),
    edit_role character varying(255),
    read_role character varying(255),
    CONSTRAINT mn_menu_group_code_check CHECK (((code)::text = ANY ((ARRAY['HOMEPAGE'::character varying, 'RECRUIT'::character varying, 'SYSTEM'::character varying])::text[]))),
    CONSTRAINT mn_menu_group_edit_role_check CHECK (((edit_role)::text = ANY ((ARRAY['ADMIN'::character varying, 'SYSTEM'::character varying])::text[]))),
    CONSTRAINT mn_menu_group_read_role_check CHECK (((read_role)::text = ANY ((ARRAY['ADMIN'::character varying, 'SYSTEM'::character varying])::text[])))
);


ALTER TABLE public.mn_menu_group OWNER TO postgres;

--
-- Name: COLUMN mn_menu_group.order_seq; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu_group.order_seq IS '메뉴 보여질 순서 설정 - 오름차순 정렬';


--
-- Name: COLUMN mn_menu_group.code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu_group.code IS '메뉴 그룹';


--
-- Name: COLUMN mn_menu_group.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu_group.name IS '메뉴명';


--
-- Name: COLUMN mn_menu_group.edit_role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu_group.edit_role IS '권한 - 수정 권한';


--
-- Name: COLUMN mn_menu_group.read_role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mn_menu_group.read_role IS '권한 - 조회 권한';


--
-- Name: mn_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mn_user (
    enable integer,
    failure_cnt integer,
    create_date timestamp(6) without time zone,
    delete_date timestamp(6) without time zone,
    edit_date timestamp(6) without time zone,
    login_date timestamp(6) without time zone,
    rec_key bigint NOT NULL,
    role character varying(10),
    id character varying(20) NOT NULL,
    name character varying(20),
    create_user character varying(50),
    delete_user character varying(50),
    edit_user character varying(50),
    password character varying(200) NOT NULL,
    CONSTRAINT mn_user_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'SYSTEM'::character varying])::text[])))
);


ALTER TABLE public.mn_user OWNER TO postgres;

--
-- Name: seq_access; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_access
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_access OWNER TO postgres;

--
-- Name: seq_adminuser; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_adminuser
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_adminuser OWNER TO postgres;

--
-- Name: seq_applicant; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_applicant
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_applicant OWNER TO postgres;

--
-- Name: seq_category; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_category
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_category OWNER TO postgres;

--
-- Name: seq_content; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_content
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_content OWNER TO postgres;

--
-- Name: seq_inquiry; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_inquiry
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_inquiry OWNER TO postgres;

--
-- Name: seq_job; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_job
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_job OWNER TO postgres;

--
-- Name: seq_mainmenu; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_mainmenu
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_mainmenu OWNER TO postgres;

--
-- Name: seq_manager; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_manager
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_manager OWNER TO postgres;

--
-- Name: seq_menu; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_menu
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_menu OWNER TO postgres;

--
-- Name: seq_notice; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_notice
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_notice OWNER TO postgres;

--
-- Name: seq_result; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_result
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_result OWNER TO postgres;

--
-- Name: seq_support; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_support
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_support OWNER TO postgres;

--
-- Name: tb_applicant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_applicant (
    answer_date timestamp(6) without time zone,
    birth_date timestamp(6) without time zone,
    create_date timestamp(6) without time zone,
    job_id bigint,
    rec_key bigint NOT NULL,
    category character varying(20),
    form_tag character varying(20),
    pass_yn character varying(20),
    email character varying(50),
    gender character varying(50),
    name character varying(50),
    nationality character varying(50),
    phone character varying(50),
    career character varying(100),
    profile_path character varying(1000),
    answer_id character varying(10000),
    content_answer character varying(10000),
    contents character varying(10000),
    files_path character varying(1000)[]
);


ALTER TABLE public.tb_applicant OWNER TO postgres;

--
-- Name: COLUMN tb_applicant.birth_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.birth_date IS '생년월일';


--
-- Name: COLUMN tb_applicant.job_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.job_id IS '지원공고';


--
-- Name: COLUMN tb_applicant.category; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.category IS '채용공고 카테고리';


--
-- Name: COLUMN tb_applicant.form_tag; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.form_tag IS '폼태그';


--
-- Name: COLUMN tb_applicant.pass_yn; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.pass_yn IS '합격여부';


--
-- Name: COLUMN tb_applicant.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.email IS '이메일';


--
-- Name: COLUMN tb_applicant.gender; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.gender IS '성별';


--
-- Name: COLUMN tb_applicant.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.name IS '지원자명';


--
-- Name: COLUMN tb_applicant.nationality; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.nationality IS '국적';


--
-- Name: COLUMN tb_applicant.phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.phone IS '휴대전화';


--
-- Name: COLUMN tb_applicant.career; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.career IS '경력구분';


--
-- Name: COLUMN tb_applicant.profile_path; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.profile_path IS '증명사진 경로';


--
-- Name: COLUMN tb_applicant.answer_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.answer_id IS '답변자';


--
-- Name: COLUMN tb_applicant.content_answer; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.content_answer IS '조회결과내용';


--
-- Name: COLUMN tb_applicant.contents; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.contents IS '자기소개서';


--
-- Name: COLUMN tb_applicant.files_path; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_applicant.files_path IS '첨부파일 경로';


--
-- Name: tb_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_category (
    create_date timestamp(6) without time zone,
    delete_date timestamp(6) without time zone,
    rec_key bigint NOT NULL,
    create_user character varying(50),
    delete_user character varying(50),
    category_name character varying(10000)
);


ALTER TABLE public.tb_category OWNER TO postgres;

--
-- Name: tb_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_code (
    use_yn integer,
    create_date timestamp(6) without time zone,
    delete_date timestamp(6) without time zone,
    edit_date timestamp(6) without time zone,
    grp character varying(10) NOT NULL,
    code character varying(20) NOT NULL,
    value1 character varying(100),
    value2 character varying(100),
    value3 character varying(100),
    description character varying(3000),
    create_user character varying(255),
    delete_user character varying(255),
    edit_user character varying(255),
    CONSTRAINT tb_code_grp_check CHECK (((grp)::text = ANY ((ARRAY['SYSTEM'::character varying, 'API'::character varying, 'AUTH'::character varying])::text[])))
);


ALTER TABLE public.tb_code OWNER TO postgres;

--
-- Name: tb_content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_content (
    hit integer DEFAULT 0,
    create_date timestamp(6) without time zone,
    delete_date timestamp(6) without time zone,
    edit_date timestamp(6) without time zone,
    rec_key bigint NOT NULL,
    category character varying(20),
    subcategory character varying(20),
    title character varying(20),
    create_user character varying(50),
    delete_user character varying(50),
    edit_user character varying(50),
    subtitle character varying(100),
    content text
);


ALTER TABLE public.tb_content OWNER TO postgres;

--
-- Name: COLUMN tb_content.hit; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_content.hit IS '조회수';


--
-- Name: tb_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_image (
    create_date timestamp(6) without time zone,
    rec_key bigint NOT NULL,
    create_user character varying(50),
    image_name character varying(255),
    key character varying(255),
    path character varying(255),
    value character varying(255)
);


ALTER TABLE public.tb_image OWNER TO postgres;

--
-- Name: tb_inquiry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_inquiry (
    hit integer DEFAULT 0,
    answer_date timestamp(6) without time zone,
    create_date timestamp(6) without time zone,
    delete_date timestamp(6) without time zone,
    rec_key bigint NOT NULL,
    update_date timestamp(6) without time zone,
    answer_user character varying(50),
    delete_user character varying(50),
    inquiry_title character varying(100),
    inquiry_email character varying(200),
    inquiry_name character varying(200),
    inquiry_phone character varying(200),
    inquiry_pwd character varying(200),
    answer character varying(10000),
    inquiry_content character varying(10000),
    answer_yn character varying(255),
    inquiry_secret character varying(255)
);


ALTER TABLE public.tb_inquiry OWNER TO postgres;

--
-- Name: COLUMN tb_inquiry.hit; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_inquiry.hit IS '조회수';


--
-- Name: COLUMN tb_inquiry.inquiry_email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_inquiry.inquiry_email IS '문의 작성한 사용자 이메일';


--
-- Name: COLUMN tb_inquiry.inquiry_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_inquiry.inquiry_name IS '문의 작성한 사용자 아이디';


--
-- Name: COLUMN tb_inquiry.inquiry_phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_inquiry.inquiry_phone IS '문의 작성한 사용자 핸드폰번호';


--
-- Name: COLUMN tb_inquiry.inquiry_pwd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_inquiry.inquiry_pwd IS '문의 작성한 사용자 비밀번호';


--
-- Name: COLUMN tb_inquiry.inquiry_content; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_inquiry.inquiry_content IS '문의 작성한 내용';


--
-- Name: COLUMN tb_inquiry.answer_yn; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_inquiry.answer_yn IS '답변여부';


--
-- Name: COLUMN tb_inquiry.inquiry_secret; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_inquiry.inquiry_secret IS '문의 공개 여부';


--
-- Name: tb_job; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_job (
    hit integer DEFAULT 0,
    create_date timestamp(6) without time zone,
    delete_date timestamp(6) without time zone,
    edit_date timestamp(6) without time zone,
    from_date timestamp(6) without time zone,
    rec_key bigint NOT NULL,
    to_date timestamp(6) without time zone,
    full_time character varying(10),
    category character varying(20),
    experience character varying(20),
    support character varying(20),
    create_user character varying(50),
    delete_user character varying(50),
    edit_user character varying(50),
    title character varying(100),
    content character varying(10000)
);


ALTER TABLE public.tb_job OWNER TO postgres;

--
-- Name: COLUMN tb_job.hit; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_job.hit IS '조회수';


--
-- Name: tb_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_menu (
    order_seq integer DEFAULT 0,
    use_yn integer DEFAULT 1,
    content_id bigint,
    create_date timestamp(6) without time zone,
    delete_date timestamp(6) without time zone,
    edit_date timestamp(6) without time zone,
    p_id bigint,
    rec_key bigint NOT NULL,
    target character varying(10) NOT NULL,
    type character varying(10) NOT NULL,
    create_user character varying(50),
    delete_user character varying(50),
    edit_user character varying(50),
    name character varying(100),
    name_english character varying(100),
    name_japanese character varying(100),
    url character varying(100),
    CONSTRAINT tb_menu_target_check CHECK (((target)::text = ANY ((ARRAY['SELF'::character varying, 'blank'::character varying])::text[]))),
    CONSTRAINT tb_menu_type_check CHECK (((type)::text = ANY ((ARRAY['GROUP'::character varying, 'GENERAL'::character varying, 'INTRO'::character varying])::text[])))
);


ALTER TABLE public.tb_menu OWNER TO postgres;

--
-- Name: COLUMN tb_menu.order_seq; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_menu.order_seq IS '메뉴 보여질 순서 설정 - 오름차순 정렬';


--
-- Name: COLUMN tb_menu.p_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_menu.p_id IS '메뉴 parent';


--
-- Name: COLUMN tb_menu.target; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_menu.target IS '새창 여부 - {self: 사용 안함, blank: 사용함}';


--
-- Name: COLUMN tb_menu.type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_menu.type IS '메뉴 타입 - { intro: 소개페이지, group: 메뉴 그룹, genernal: 일반 }';


--
-- Name: tb_notice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_notice (
    hit integer DEFAULT 0,
    create_date timestamp(6) without time zone,
    delete_date timestamp(6) without time zone,
    edit_date timestamp(6) without time zone,
    from_date timestamp(6) without time zone,
    rec_key bigint NOT NULL,
    to_date timestamp(6) without time zone,
    category character varying(20),
    create_user character varying(50),
    delete_user character varying(50),
    edit_user character varying(50),
    title character varying(100),
    content text
);


ALTER TABLE public.tb_notice OWNER TO postgres;

--
-- Name: COLUMN tb_notice.hit; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tb_notice.hit IS '조회수';


--
-- Name: tb_result; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_result (
    rec_key bigint NOT NULL,
    category character varying(20),
    template_id character varying(100),
    template_content character varying(1000)
);


ALTER TABLE public.tb_result OWNER TO postgres;

--
-- Name: tb_support; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_support (
    create_date timestamp(6) without time zone,
    delete_date timestamp(6) without time zone,
    rec_key bigint NOT NULL,
    create_user character varying(50),
    delete_user character varying(50),
    support_name character varying(10000)
);


ALTER TABLE public.tb_support OWNER TO postgres;

--
-- Name: 121978; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('121978');


ALTER LARGE OBJECT 121978 OWNER TO postgres;

--
-- Name: 92353; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('92353');


ALTER LARGE OBJECT 92353 OWNER TO postgres;

--
-- Name: 93778; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('93778');


ALTER LARGE OBJECT 93778 OWNER TO postgres;

--
-- Name: 95922; Type: BLOB; Schema: -; Owner: postgres
--

SELECT pg_catalog.lo_create('95922');


ALTER LARGE OBJECT 95922 OWNER TO postgres;

--
-- Data for Name: mn_access_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mn_access_log (login_result, login_date, rec_key, login_id, login_ip) FROM stdin;
\.


--
-- Data for Name: mn_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mn_menu (order_seq, use_yn, create_date, edit_date, code, group_id, name, create_user, edit_user, url, code_detail, edit_role, icon, read_role, target) FROM stdin;
1	1	2024-01-08 04:57:06.283792	\N	INTRODUCTIONS	HOMEPAGE	소개글 관리	\N	\N	/admin/introductions	INTRODUCTION	\N	fas fa-handshake	\N	SELF
2	1	2024-01-08 04:57:06.283792	\N	NOTICES	HOMEPAGE	공지사항 관리	\N	\N	/admin/notices	NOTICE	\N	fas fa-volume-down	\N	SELF
3	1	2024-01-08 04:57:06.283792	\N	JOBS	RECRUIT	채용 공고 관리	\N	\N	/admin/jobs	JOB	\N	fas fa-exclamation-circle	\N	SELF
4	1	2024-01-08 04:57:06.283792	\N	APPLICANTS	RECRUIT	지원자 조회	\N	\N	/admin/applicants	APPLICANT	\N	fas fa-id-badge	\N	SELF
5	1	2024-01-08 04:57:06.283792	\N	INQUIRES	RECRUIT	채용 문의	\N	\N	/admin/inquires	INQUIRY	\N	fas fa-question-circle	\N	SELF
6	1	2024-01-08 04:57:06.283792	\N	ACCESS	SYSTEM	접속 기록	\N	\N	/admin/access	\N	\N	fas fa-sign-in-alt	\N	SELF
7	1	2024-01-08 04:57:06.283792	\N	ACCOUNTS	SYSTEM	관리자 계정 조회	\N	\N	/admin/accounts	ACCOUNT	\N	fas fa-users-cog	\N	SELF
\.


--
-- Data for Name: mn_menu_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mn_menu_group (order_seq, use_yn, create_date, edit_date, code, name, create_user, edit_user, edit_role, read_role) FROM stdin;
1	1	2024-01-08 04:57:06.255796	\N	HOMEPAGE	홈페이지 관리	\N	\N	\N	\N
2	1	2024-01-08 04:57:06.255796	\N	RECRUIT	채용 관리	\N	\N	\N	\N
3	1	2024-01-08 04:57:06.255796	\N	SYSTEM	시스템 관리	\N	\N	\N	\N
\.


--
-- Data for Name: mn_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mn_user (enable, failure_cnt, create_date, delete_date, edit_date, login_date, rec_key, role, id, name, create_user, delete_user, edit_user, password) FROM stdin;
1	0	2024-01-08 04:57:06.235607	\N	\N	\N	1	SYSTEM	nicom	나이콤 관리자	\N	\N	\N	$2a$10$SB9sdkvpe7I0Lz2epBIkwufxjkRIlZbHke6UGFKrSKA4aQnhH.Vda
\.


--
-- Data for Name: tb_applicant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_applicant (answer_date, birth_date, create_date, job_id, rec_key, category, form_tag, pass_yn, email, gender, name, nationality, phone, career, profile_path, answer_id, content_answer, contents, files_path) FROM stdin;
\.


--
-- Data for Name: tb_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_category (create_date, delete_date, rec_key, create_user, delete_user, category_name) FROM stdin;
2024-01-08 04:57:06.37626	\N	1	\N	\N	프런트
2024-01-08 04:57:06.37626	\N	2	\N	\N	레스토랑
2024-01-08 04:57:06.37626	\N	3	\N	\N	하우스키핑
\.


--
-- Data for Name: tb_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_code (use_yn, create_date, delete_date, edit_date, grp, code, value1, value2, value3, description, create_user, delete_user, edit_user) FROM stdin;
\N	2024-01-08 04:57:06.116743	\N	\N	SYSTEM	initPwd	nicom123.	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: tb_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_content (hit, create_date, delete_date, edit_date, rec_key, category, subcategory, title, create_user, delete_user, edit_user, subtitle, content) FROM stdin;
\.


--
-- Data for Name: tb_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_image (create_date, rec_key, create_user, image_name, key, path, value) FROM stdin;
\.


--
-- Data for Name: tb_inquiry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_inquiry (hit, answer_date, create_date, delete_date, rec_key, update_date, answer_user, delete_user, inquiry_title, inquiry_email, inquiry_name, inquiry_phone, inquiry_pwd, answer, inquiry_content, answer_yn, inquiry_secret) FROM stdin;
\.


--
-- Data for Name: tb_job; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_job (hit, create_date, delete_date, edit_date, from_date, rec_key, to_date, full_time, category, experience, support, create_user, delete_user, edit_user, title, content) FROM stdin;
\.


--
-- Data for Name: tb_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_menu (order_seq, use_yn, content_id, create_date, delete_date, edit_date, p_id, rec_key, target, type, create_user, delete_user, edit_user, name, name_english, name_japanese, url) FROM stdin;
1	1	\N	2024-01-08 04:57:06.335382	\N	\N	\N	1	SELF	GROUP	\N	\N	\N	회사소개	About Us	会社紹介	\N
2	1	\N	2024-01-08 04:57:06.335382	\N	\N	\N	2	SELF	GROUP	\N	\N	\N	사업영역	Business area	事業領域	\N
3	1	\N	2024-01-08 04:57:06.335382	\N	\N	\N	3	SELF	GROUP	\N	\N	\N	뉴스	announcement	お知らせ	\N
4	1	\N	2024-01-08 04:57:06.335382	\N	\N	\N	4	SELF	GROUP	\N	\N	\N	채용정보	Recruitment information	採用情報	\N
1	1	\N	2024-01-08 04:57:06.350521	\N	\N	1	5	SELF	INTRO	\N	\N	\N	기업개요	Company Overview	企業概要	/intro/overview
2	1	\N	2024-01-08 04:57:06.350521	\N	\N	1	6	SELF	INTRO	\N	\N	\N	경영이념/비전	Management philosophy/vision	経営理念/ビジョン	/intro/vision
3	1	\N	2024-01-08 04:57:06.350521	\N	\N	1	7	SELF	INTRO	\N	\N	\N	연혁	history	歴史	/intro/history
4	1	\N	2024-01-08 04:57:06.350521	\N	\N	1	8	SELF	INTRO	\N	\N	\N	조직도	organization	組織図	/intro/organization
5	1	\N	2024-01-08 04:57:06.350521	\N	\N	1	9	SELF	INTRO	\N	\N	\N	오시는길	way to come	アクセス	/intro/location
2	1	\N	2024-01-08 04:57:06.350521	\N	\N	2	10	SELF	INTRO	\N	\N	\N	도미인	Dormy Inn	ドーミー	/business/dormyinn
1	1	\N	2024-01-08 04:57:06.350521	\N	\N	4	11	SELF	GENERAL	\N	\N	\N	채용안내	Recruitment information	採用案内	/recruit/info
2	1	\N	2024-01-08 04:57:06.350521	\N	\N	4	12	SELF	GENERAL	\N	\N	\N	채용공고	Recruitment notice	採用発表	/recruit/notice
3	1	\N	2024-01-08 04:57:06.350521	\N	\N	4	13	SELF	GENERAL	\N	\N	\N	채용지원	Recruitment support	採用支援	/recruit/apply
4	1	\N	2024-01-08 04:57:06.350521	\N	\N	4	14	SELF	GENERAL	\N	\N	\N	채용문의	Recruitment Inquiry	採用お問い合わせ	/recruit/inquire
1	1	\N	2024-01-08 04:57:06.350521	\N	\N	3	15	SELF	GENERAL	\N	\N	\N	공지사항	announcement	お知らせ	/notice/notice
\.


--
-- Data for Name: tb_notice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_notice (hit, create_date, delete_date, edit_date, from_date, rec_key, to_date, category, create_user, delete_user, edit_user, title, content) FROM stdin;
\.


--
-- Data for Name: tb_result; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_result (rec_key, category, template_id, template_content) FROM stdin;
\.


--
-- Data for Name: tb_support; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tb_support (create_date, delete_date, rec_key, create_user, delete_user, support_name) FROM stdin;
\.


--
-- Name: seq_access; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_access', 1, false);


--
-- Name: seq_adminuser; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_adminuser', 1, true);


--
-- Name: seq_applicant; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_applicant', 1, false);


--
-- Name: seq_category; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_category', 3, true);


--
-- Name: seq_content; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_content', 1, false);


--
-- Name: seq_inquiry; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_inquiry', 1, false);


--
-- Name: seq_job; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_job', 1, false);


--
-- Name: seq_mainmenu; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_mainmenu', 15, true);


--
-- Name: seq_manager; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_manager', 1, true);


--
-- Name: seq_menu; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_menu', 18, true);


--
-- Name: seq_notice; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_notice', 1, false);


--
-- Name: seq_result; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_result', 1, false);


--
-- Name: seq_support; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_support', 1, false);


--
-- Data for Name: BLOBS; Type: BLOBS; Schema: -; Owner: -
--

BEGIN;

SELECT pg_catalog.lo_open('92353', 131072);
SELECT pg_catalog.lowrite(0, '\x3c703e6a6a3c2f703e');
SELECT pg_catalog.lo_close(0);

SELECT pg_catalog.lo_open('93778', 131072);
SELECT pg_catalog.lowrite(0, '\x3c703e6a3c2f703e');
SELECT pg_catalog.lo_close(0);

SELECT pg_catalog.lo_open('95922', 131072);
SELECT pg_catalog.lowrite(0, '\x3c703e6a3c2f703e');
SELECT pg_catalog.lo_close(0);

SELECT pg_catalog.lo_open('121978', 131072);
SELECT pg_catalog.lowrite(0, '\x3c703e696f3c2f703e');
SELECT pg_catalog.lo_close(0);

COMMIT;

--
-- Name: mn_access_log mn_access_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mn_access_log
    ADD CONSTRAINT mn_access_log_pkey PRIMARY KEY (rec_key);


--
-- Name: mn_menu_group mn_menu_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mn_menu_group
    ADD CONSTRAINT mn_menu_group_pkey PRIMARY KEY (code);


--
-- Name: mn_menu mn_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mn_menu
    ADD CONSTRAINT mn_menu_pkey PRIMARY KEY (code);


--
-- Name: mn_user mn_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mn_user
    ADD CONSTRAINT mn_user_id_key UNIQUE (id);


--
-- Name: mn_user mn_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mn_user
    ADD CONSTRAINT mn_user_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_applicant tb_applicant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_applicant
    ADD CONSTRAINT tb_applicant_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_category tb_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_category
    ADD CONSTRAINT tb_category_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_code tb_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_code
    ADD CONSTRAINT tb_code_pkey PRIMARY KEY (grp, code);


--
-- Name: tb_content tb_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_content
    ADD CONSTRAINT tb_content_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_image tb_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_image
    ADD CONSTRAINT tb_image_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_inquiry tb_inquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_inquiry
    ADD CONSTRAINT tb_inquiry_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_job tb_job_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_job
    ADD CONSTRAINT tb_job_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_menu tb_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_menu
    ADD CONSTRAINT tb_menu_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_notice tb_notice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_notice
    ADD CONSTRAINT tb_notice_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_result tb_result_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_result
    ADD CONSTRAINT tb_result_pkey PRIMARY KEY (rec_key);


--
-- Name: tb_support tb_support_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_support
    ADD CONSTRAINT tb_support_pkey PRIMARY KEY (rec_key);


--
-- Name: mn_menu fk1d58it64xspo4x8i9uvmvc0rh; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mn_menu
    ADD CONSTRAINT fk1d58it64xspo4x8i9uvmvc0rh FOREIGN KEY (group_id) REFERENCES public.mn_menu_group(code);


--
-- Name: tb_applicant fk7auqtul6lvqgwolwqtq7rnnv9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_applicant
    ADD CONSTRAINT fk7auqtul6lvqgwolwqtq7rnnv9 FOREIGN KEY (job_id) REFERENCES public.tb_job(rec_key);


--
-- Name: tb_menu fkh4tae9dltypqmsxth1pcm5xof; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_menu
    ADD CONSTRAINT fkh4tae9dltypqmsxth1pcm5xof FOREIGN KEY (content_id) REFERENCES public.tb_content(rec_key);


--
-- Name: tb_menu fkrn67sgl7kot5s734lc5i862km; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_menu
    ADD CONSTRAINT fkrn67sgl7kot5s734lc5i862km FOREIGN KEY (p_id) REFERENCES public.tb_menu(rec_key);


--
-- PostgreSQL database dump complete
--


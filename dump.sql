--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)

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
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token text NOT NULL
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.urls (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "shortUrl" text NOT NULL,
    url text NOT NULL
);


--
-- Name: urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.urls_id_seq OWNED BY public.urls.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: visitCount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."visitCount" (
    id integer NOT NULL,
    "idUrl" integer NOT NULL,
    "visitCount" integer NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: visitCount_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."visitCount_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: visitCount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."visitCount_id_seq" OWNED BY public."visitCount".id;


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls ALTER COLUMN id SET DEFAULT nextval('public.urls_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: visitCount id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."visitCount" ALTER COLUMN id SET DEFAULT nextval('public."visitCount_id_seq"'::regclass);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sessions VALUES (1, 3, '7955ec56-5d50-42f0-9e9d-4459f0f0afda');
INSERT INTO public.sessions VALUES (2, 3, 'a71828bf-beab-41a7-9d95-2b5abbe83c8f');
INSERT INTO public.sessions VALUES (3, 4, '66b7cf0d-2fd9-4445-9261-aec47298a445');
INSERT INTO public.sessions VALUES (4, 4, '17a02884-7e90-44f5-953a-1e19830a06af');


--
-- Data for Name: urls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.urls VALUES (2, 1, 'aaasssfe', 'adafaefaw');
INSERT INTO public.urls VALUES (4, 1, 'aaasssfe', 'adafaefaw');
INSERT INTO public.urls VALUES (5, 3, 'Q-GKTtyQE8', 'https://stackoverflow.com/questions/11769860/connect-to-a-heroku-database-with-pgadmin');
INSERT INTO public.urls VALUES (6, 3, 'PxB8juetyq', 'https://stackoverflow.com/questions/11769860/connect-to-a-heroku-database-with-pgadmin');
INSERT INTO public.urls VALUES (7, 3, 'mLYWrGjeB8', 'https://stackoverflow.com/questions/11769860/connect-to-a-heroku-database-with-pgadmin');
INSERT INTO public.urls VALUES (8, 3, 'hgJ6qEyh20', 'https://stackoverflow.com/questions/11769860/connect-to-a-heroku-database-with-pgadmin');
INSERT INTO public.urls VALUES (9, 3, 'XdAEjGEeoQ', 'https://stackoverflow.com/questions/11769860/connect-to-a-heroku-database-with-pgadmin');
INSERT INTO public.urls VALUES (10, 3, 'Cyrfi9l-7c', 'https://stackoverflow.com/questions/11769860/connect-to-a-heroku-database-with-pgadmin');
INSERT INTO public.urls VALUES (11, 3, 'YLkZMqQizF', 'https://stackoverflow.com/questions/11769860/connect-to-a-heroku-database-with-pgadmin');
INSERT INTO public.urls VALUES (12, 3, 'SokzbyfwtW', 'https://stackoverflow.com/questions/11769860/connect-to-a-heroku-database-with-pgadmin');
INSERT INTO public.urls VALUES (13, 3, 'ftLewfnlce', 'https://stackoverflow.com/questions/11769860/connect-to-a-heroku-database-with-pgadmin');
INSERT INTO public.urls VALUES (14, 3, 'YRaukuiYU4', 'https://bootcampra.notion.site/Pr-tica-Exerc-cios-Group-By-a9a309114f8b4f60afc1076502446b58');
INSERT INTO public.urls VALUES (15, 4, 'nA82fvU3rf', 'https://www.google.com/');
INSERT INTO public.urls VALUES (16, 4, 'UAmD3qElYc', 'https://www.youtube.com/');
INSERT INTO public.urls VALUES (17, 4, 'd5al085u0-', 'https://www.google.com/search?q=driven&oq=driven&aqs=chrome..69i57j69i65l2j69i60l2.3059j0j4&sourceid=chrome&ie=UTF-8');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'teste01', 'teste01@gmail.com', 'teste01');
INSERT INTO public.users VALUES (2, 'teste02', 'teste02@gmail.com', 'teste02');
INSERT INTO public.users VALUES (3, 'João2', 'teste03@gmail.com', '$2b$10$P1JRzrgeCX2e62At2lhka.oJCl2Xf01pkIdWWNOAcV2esP.MNC0Bq');
INSERT INTO public.users VALUES (4, 'João04', 'joao04@driven.com.br', '$2b$10$G116392x5OMixGPgkt8adewk684c9r/B10d4SVAKFj28E4blDeA3.');


--
-- Data for Name: visitCount; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."visitCount" VALUES (2, 14, 2, 3);
INSERT INTO public."visitCount" VALUES (3, 15, 4, 4);
INSERT INTO public."visitCount" VALUES (4, 16, 2, 4);
INSERT INTO public."visitCount" VALUES (5, 17, 1, 4);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 4, true);


--
-- Name: urls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.urls_id_seq', 17, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: visitCount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."visitCount_id_seq"', 5, true);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: urls urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visitCount visitCount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."visitCount"
    ADD CONSTRAINT "visitCount_pkey" PRIMARY KEY (id);


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: urls urls_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT "urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: visitCount visitCount_idUrl_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."visitCount"
    ADD CONSTRAINT "visitCount_idUrl_fkey" FOREIGN KEY ("idUrl") REFERENCES public.urls(id);


--
-- PostgreSQL database dump complete
--


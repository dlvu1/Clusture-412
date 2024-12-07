--
-- PostgreSQL database dump
--

-- Dumped from database version 17rc1
-- Dumped by pg_dump version 17rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: board_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.board_id_seq
    START WITH 6
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.board_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: board; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.board (
    boardid integer DEFAULT nextval('public.board_id_seq'::regclass) NOT NULL,
    boardname character varying(255),
    userid integer,
    description text,
    categoryid integer[],
    createdat timestamp without time zone,
    isprivate boolean,
    imageurl character varying(255)
);


ALTER TABLE public.board OWNER TO postgres;

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    categoryid integer NOT NULL,
    categoryname character varying(255)
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    commentid integer NOT NULL,
    commenttext text,
    pinid integer,
    userid integer,
    createdat timestamp without time zone
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: follow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follow (
    followerid integer,
    followedid integer
);


ALTER TABLE public.follow OWNER TO postgres;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    userid integer,
    notificationtext text,
    notificationtype character varying(50)
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: pin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pin (
    pinid integer NOT NULL,
    title character varying(255),
    sourceurl character varying(255),
    imageurl character varying(255),
    likes integer,
    categoryid integer[],
    tagid integer[],
    boardid integer,
    userid integer,
    createdat timestamp without time zone,
    description text
);


ALTER TABLE public.pin OWNER TO postgres;

--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    tagid integer NOT NULL,
    tagname character varying(255)
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(255),
    password character varying(255),
    email character varying(255),
    createdat timestamp without time zone,
    profilepic character varying(255),
    description text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: board; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.board (boardid, boardname, userid, description, categoryid, createdat, isprivate, imageurl) FROM stdin;
1	Travel Ideas	1	A board for travel inspirations	{1,2}	2024-10-11 00:00:00	f	/images/image1.jpg
2	Recipe Collection	2	A board for my favorite recipes	{3}	2024-10-11 00:00:00	t	/images/image2.jpg
3	Home Decor	3	Ideas for home decoration	{4,5}	2024-10-11 00:00:00	f	/images/image3.jpg
4	Fitness Goals	4	My fitness motivation board	{6}	2024-10-11 00:00:00	f	/images/image4.jpg
5	Travel Inspirations 	1	A board for people love traveling	{1,2}	2024-10-11 00:00:00	f	/images/image5.jpg
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (categoryid, categoryname) FROM stdin;
1	Beach
2	Nature
3	Recipes
4	Home
5	Interior Design
6	Health & Fitness
\.


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment (commentid, commenttext, pinid, userid, createdat) FROM stdin;
\.


--
-- Data for Name: follow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.follow (followerid, followedid) FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (userid, notificationtext, notificationtype) FROM stdin;
\.


--
-- Data for Name: pin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pin (pinid, title, sourceurl, imageurl, likes, categoryid, tagid, boardid, userid, createdat, description) FROM stdin;
1	Beautiful Beach	http://source.com/beach	http://images.com/beach.jpg	120	{1}	{1}	1	1	2024-10-11 00:00:00	A beautiful beach view
2	Delicious Lasagna	http://recipe.com/lasagna	http://images.com/lasagna.jpg	89	{3}	{2}	2	2	2024-10-11 00:00:00	A delicious homemade lasagna
3	Living Room Design	http://homedecor.com/livingroom	http://images.com/livingroom.jpg	45	{4,5}	{3}	3	3	2024-10-11 00:00:00	Cozy living room decoration
4	Morning Workout	http://fitness.com/morningworkout	http://images.com/workout.jpg	67	{6}	{4}	4	4	2024-10-11 00:00:00	A simple morning workout routine
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag (tagid, tagname) FROM stdin;
1	Travel
2	Food
3	Decor
4	Fitness
5	Beauty
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (userid, username, password, email, createdat, profilepic, description) FROM stdin;
1	user1	password1	user1@example.com	2024-10-11 00:00:00	profilepic1.jpg	User 1\ndescription
2	user2	password2	user2@example.com	2024-10-11 00:00:00	profilepic2.jpg	User 2\ndescription
3	user3	password3	user3@example.com	2024-10-11 00:00:00	profilepic3.jpg	User 3\ndescription
4	user4	password4	user4@example.com	2024-10-11 00:00:00	profilepic4.jpg	User 4\ndescription
\.


--
-- Name: board_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.board_id_seq', 6, true);


--
-- Name: board board_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board
    ADD CONSTRAINT board_pkey PRIMARY KEY (boardid);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (categoryid);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (commentid);


--
-- Name: pin pin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pin
    ADD CONSTRAINT pin_pkey PRIMARY KEY (pinid);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (tagid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: board board_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board
    ADD CONSTRAINT board_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: comment comment_pinid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pinid_fkey FOREIGN KEY (pinid) REFERENCES public.pin(pinid);


--
-- Name: comment comment_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: follow follow_followedid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow
    ADD CONSTRAINT follow_followedid_fkey FOREIGN KEY (followedid) REFERENCES public.users(userid);


--
-- Name: follow follow_followerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow
    ADD CONSTRAINT follow_followerid_fkey FOREIGN KEY (followerid) REFERENCES public.users(userid);


--
-- Name: notification notification_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: pin pin_boardid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pin
    ADD CONSTRAINT pin_boardid_fkey FOREIGN KEY (boardid) REFERENCES public.board(boardid) ON DELETE CASCADE;


--
-- Name: pin pin_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pin
    ADD CONSTRAINT pin_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- PostgreSQL database dump complete
--


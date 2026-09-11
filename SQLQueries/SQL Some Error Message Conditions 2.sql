DELETE FROM titles WHERE title_id NOT LIKE '[a-zA-Z][a-zA-Z][0-9][0-9][0-9][0-9]';

ALTER TABLE titles ADD CONSTRAINT CHK_TitleIdFormat CHECK (title_id LIKE '[a-zA-Z][a-zA-Z][0-9][0-9][0-9][0-9]');
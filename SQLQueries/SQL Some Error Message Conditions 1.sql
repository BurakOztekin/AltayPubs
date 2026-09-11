DELETE FROM titleauthor WHERE royaltyper < 1 OR royaltyper > 100 OR au_ord < 1;

ALTER TABLE titleauthor ADD CONSTRAINT CHK_Royalty CHECK (royaltyper BETWEEN 1 AND 100);
ALTER TABLE titleauthor ADD CONSTRAINT CHK_AuthorOrder CHECK (au_ord >= 1);
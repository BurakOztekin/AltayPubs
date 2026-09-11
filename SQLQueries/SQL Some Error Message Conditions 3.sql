UPDATE titles SET price = 0 WHERE price < 0;
UPDATE titles SET ytd_sales = 0 WHERE ytd_sales < 0;

ALTER TABLE titles ADD CONSTRAINT CHK_TitlePrice CHECK (price >= 0);
ALTER TABLE titles ADD CONSTRAINT CHK_TitleYtdSales CHECK (ytd_sales >= 0);
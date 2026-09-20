DELETE FROM "HistoricalEra"
WHERE "id" NOT IN (
  SELECT MIN("id")
  FROM "HistoricalEra"
  GROUP BY "monumentId", "year", "eraName"
);

CREATE UNIQUE INDEX "HistoricalEra_monumentId_year_eraName_key"
ON "HistoricalEra"("monumentId", "year", "eraName");

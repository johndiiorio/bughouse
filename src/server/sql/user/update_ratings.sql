UPDATE users
SET ${updateRatingsMode} = CASE id
	WHEN ${id1} THEN ROUND(${p1Value})
	WHEN ${id2} THEN ROUND(${p2Value})
	WHEN ${id3} THEN ROUND(${p3Value})
	WHEN ${id4} THEN ROUND(${p4Value})
	END
WHERE id IN (${id1},${id2},${id3},${id4})

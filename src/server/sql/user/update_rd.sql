UPDATE users
SET ${updateRdMode~} = CASE id
	WHEN ${id1} THEN ${p1Value}
	WHEN ${id2} THEN ${p2Value}
	WHEN ${id3} THEN ${p3Value}
	WHEN ${id4} THEN ${p4Value}
	END
WHERE id IN (${id1}, ${id2}, ${id3}, ${id4})

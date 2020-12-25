ALTER TABLE g5_write_content_game AUTO_INCREMENT = 1; 
ALTER TABLE g5_write_content_movie AUTO_INCREMENT = 1; 
ALTER TABLE g5_write_content_tvseries AUTO_INCREMENT = 1; 


SELECT bo_table, bo_count_write FROM g5_board where bo_table like '%content%';


update g5_board set bo_count_write = 0 where bo_table = "content_game";
update g5_board set bo_count_write = 0 where bo_table = "content_movie";
update g5_board set bo_count_write = 0 where bo_table = "content_tvseries";

SELECT bo_table, bo_count_write FROM g5_board where bo_table like '%content%';
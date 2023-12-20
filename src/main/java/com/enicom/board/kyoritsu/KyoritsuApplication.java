package com.enicom.board.kyoritsu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 *  Main Class
**/

@SpringBootApplication
@EnableJpaRepositories
public class KyoritsuApplication {

	public static void main(String[] args) {
		SpringApplication.run(KyoritsuApplication.class, args);
	}

}

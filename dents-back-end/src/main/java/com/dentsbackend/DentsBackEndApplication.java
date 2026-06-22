package com.dentsbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DentsBackEndApplication {

	public static void main(String[] args) {
		SpringApplication.run(DentsBackEndApplication.class, args);
	}

}

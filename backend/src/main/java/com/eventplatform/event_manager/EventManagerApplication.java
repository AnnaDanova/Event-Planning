package com.eventplatform.event_manager;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableScheduling
public class EventManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventManagerApplication.class, args);
	}

}

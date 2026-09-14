package com.civicfix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * CIVICFIX - Smart Local Issue Reporting & Resolution System
 * Production Spring Boot Application Entry Point
 * 
 * Tagline: Report. Track. Resolve.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@EnableConfigurationProperties
public class CivicFixApplication {

    public static void main(String[] args) {
        SpringApplication.run(CivicFixApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  CIVICFIX SYSTEM BOOTED SUCCESSFULLY (PORT 3000)");
        System.out.println("  Smart Local Issue Reporting & Resolution System");
        System.out.println("  Ready for Citizen, Officer, Worker, and Admin   ");
        System.out.println("=================================================");
    }
}

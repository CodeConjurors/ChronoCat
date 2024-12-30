package com.chronocat.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@SpringBootApplication
@Controller
public class BackendController {

    @GetMapping("*")
    @ResponseBody
    public String home() {
        return "Hello world!";
    }

	public static void main(String[] args) {
		SpringApplication.run(BackendController.class, args);
	}

}

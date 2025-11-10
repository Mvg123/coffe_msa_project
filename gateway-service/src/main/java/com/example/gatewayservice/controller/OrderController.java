package com.example.gatewayservice.controller;

import com.example.gatewayservice.service.RabbitMQService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final RabbitMQService rabbitMQService;

    @PostMapping("/complete")
    public void orderComplete(@RequestBody OrderCompleteMessage message) {
        System.out.println("주문 완료 메시지 수신: " + message);
        try {
            rabbitMQService.sendMessage(message);
            System.out.println("RabbitMQ로 메시지 전송 성공");
        } catch (Exception e) {
            System.err.println("RabbitMQ로 메시지 전송 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}


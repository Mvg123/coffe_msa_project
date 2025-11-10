package com.example.gatewayservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_BOARD = "board-queue";
    public static final String EXCHANGE_BOARD = "board-exchange";
    public static final String ROUTING_KEY_BOARD = "board.message";

    @Bean
    public Queue boardQueue() {
        return QueueBuilder.durable(QUEUE_BOARD)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", QUEUE_BOARD + ".dlq")
                .build();
    }

    @Bean
    public TopicExchange boardExchange() {
        return new TopicExchange(EXCHANGE_BOARD);
    }

    @Bean
    public Binding boardBinding() {
        return BindingBuilder
                .bind(boardQueue())
                .to(boardExchange())
                .with(ROUTING_KEY_BOARD);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
} 
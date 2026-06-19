package com.eventplatform.event_manager.domain.enums;

public enum NotificationType {

    EVENT_REMINDER("Предстоящо събитие"),
    SESSION_STARTING("Сесията започва скоро!"),
    SPEAKER_BRIEFING("Напомняне за лектор"),

    SCHEDULE_CHANGED("Промяна в програмата"),
    EVENT_CANCELLED("Отмяна на събитие"),

    TICKET_CONFIRMED("Успешна покупка на билет"),
    PAYMENT_FAILED("Проблем с плащането"),

    FEEDBACK_REQUEST("Вашето мнение е важно за нас");

    private final String defaultTitle;

    NotificationType(String defaultTitle) {
        this.defaultTitle = defaultTitle;
    }

    public String getDefaultTitle() {
        return defaultTitle;
    }
}

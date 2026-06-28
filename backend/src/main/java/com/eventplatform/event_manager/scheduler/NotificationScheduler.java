package com.eventplatform.event_manager.scheduler;

import com.eventplatform.event_manager.domain.NotificationTemplate;
import com.eventplatform.event_manager.domain.Ticket;
import com.eventplatform.event_manager.repository.NotificationTemplateRepository;
import com.eventplatform.event_manager.repository.TicketRepository;
import com.eventplatform.event_manager.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final NotificationTemplateRepository templateRepository;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void sendScheduledNotifications() {
        LocalDateTime now = LocalDateTime.now();

        List<NotificationTemplate> templates =
                templateRepository.findByScheduledAtBeforeAndSentFalse(now);

        for (NotificationTemplate template : templates) {
            if (template.getEvent() == null) {
                continue;
            }

            Long eventId = template.getEvent().getId();

            List<Ticket> tickets = ticketRepository.findByTicketCategoryEventId(eventId);

            tickets.stream()
                    .map(Ticket::getUser)
                    .distinct()
                    .forEach(user -> {
                        try {
                            notificationService.sendNotification(user.getId(), template.getId());
                        } catch (Exception e) {
                            System.out.println("Грешка при изпращане на нотификация: " + e.getMessage());
                        }
                    });

            if (template.getEvent().getOrganizer() != null) {
                try {
                    notificationService.sendNotification(template.getEvent().getOrganizer().getId(), template.getId());
                } catch (Exception e) {
                    System.out.println("Грешка при изпращане на нотификация към организатор: " + e.getMessage());
                }
            }
            template.setSent(true);
            templateRepository.save(template);
        }
    }
}
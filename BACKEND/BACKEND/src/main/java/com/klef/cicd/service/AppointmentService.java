package com.klef.cicd.service;

import java.util.List;
import com.klef.cicd.entity.Appointment;

public interface AppointmentService {
    Appointment addAppointment(Appointment appointment);
    List<Appointment> getAllAppointments();
    Appointment getAppointmentById(int id);
    Appointment updateAppointment(Appointment appointment);
    void deleteAppointmentById(int id);
}

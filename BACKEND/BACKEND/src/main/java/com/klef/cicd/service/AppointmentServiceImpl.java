package com.klef.cicd.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.klef.cicd.entity.Appointment;
import com.klef.cicd.repository.AppointmentRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public Appointment addAppointment(Appointment appointment) {
        // Don't set ID manually; it's auto-generated
        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Appointment getAppointmentById(int id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    @Override
    public Appointment updateAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public void deleteAppointmentById(int id) {
        appointmentRepository.deleteById(id);
    }
}

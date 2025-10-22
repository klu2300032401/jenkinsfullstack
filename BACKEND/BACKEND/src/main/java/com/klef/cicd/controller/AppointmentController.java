package com.klef.cicd.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.klef.cicd.entity.Appointment;
import com.klef.cicd.service.AppointmentService;

@RestController
@RequestMapping("/appointmentapi")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/add")
    public ResponseEntity<Appointment> addAppointment(@RequestBody Appointment appointment) {
        Appointment saved = appointmentService.addAppointment(appointment);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> list = appointmentService.getAllAppointments();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable int id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        if (appointment != null) {
            return new ResponseEntity<>(appointment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Appointment> updateAppointment(@RequestBody Appointment appointment) {
        Appointment updated = appointmentService.updateAppointment(appointment);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable int id) {
        appointmentService.deleteAppointmentById(id);
        return new ResponseEntity<>("Appointment deleted successfully.", HttpStatus.OK);
    }
}

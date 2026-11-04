package com.mgnregs.controller;

import com.mgnregs.entity.*;
import com.mgnregs.service.MasterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/master")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MasterController {

    private final MasterService masterService;

    @GetMapping("/states")
    public ResponseEntity<List<State>> getStates() {
        return ResponseEntity.ok(masterService.getAllStates());
    }

    @PostMapping("/states")
    public ResponseEntity<State> createState(@RequestBody State state) {
        return ResponseEntity.ok(masterService.createState(state));
    }

    @GetMapping("/states/{stateId}/districts")
    public ResponseEntity<List<District>> getDistricts(@PathVariable Long stateId) {
        return ResponseEntity.ok(masterService.getDistrictsByState(stateId));
    }

    @PostMapping("/districts")
    public ResponseEntity<District> createDistrict(@RequestBody District district) {
        return ResponseEntity.ok(masterService.createDistrict(district));
    }

    @GetMapping("/districts/{districtId}/blocks")
    public ResponseEntity<List<Block>> getBlocks(@PathVariable Long districtId) {
        return ResponseEntity.ok(masterService.getBlocksByDistrict(districtId));
    }

    @PostMapping("/blocks")
    public ResponseEntity<Block> createBlock(@RequestBody Block block) {
        return ResponseEntity.ok(masterService.createBlock(block));
    }

    @GetMapping("/blocks/{blockId}/panchayats")
    public ResponseEntity<List<Panchayat>> getPanchayats(@PathVariable Long blockId) {
        return ResponseEntity.ok(masterService.getPanchayatsByBlock(blockId));
    }

    @PostMapping("/panchayats")
    public ResponseEntity<Panchayat> createPanchayat(@RequestBody Panchayat panchayat) {
        return ResponseEntity.ok(masterService.createPanchayat(panchayat));
    }

    @GetMapping("/panchayats/{panchayatId}/villages")
    public ResponseEntity<List<Village>> getVillages(@PathVariable Long panchayatId) {
        return ResponseEntity.ok(masterService.getVillagesByPanchayat(panchayatId));
    }

    @PostMapping("/villages")
    public ResponseEntity<Village> createVillage(@RequestBody Village village) {
        return ResponseEntity.ok(masterService.createVillage(village));
    }
}

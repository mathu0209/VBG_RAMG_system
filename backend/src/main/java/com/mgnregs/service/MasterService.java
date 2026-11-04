package com.mgnregs.service;

import com.mgnregs.entity.*;
import com.mgnregs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MasterService {

    private final StateRepository stateRepository;
    private final DistrictRepository districtRepository;
    private final BlockRepository blockRepository;
    private final PanchayatRepository panchayatRepository;
    private final VillageRepository villageRepository;

    public List<State> getAllStates() { return stateRepository.findAll(); }
    public State createState(State state) { return stateRepository.save(state); }

    public List<District> getDistrictsByState(Long stateId) { return districtRepository.findByStateId(stateId); }
    public District createDistrict(District district) { return districtRepository.save(district); }

    public List<Block> getBlocksByDistrict(Long districtId) { return blockRepository.findByDistrictId(districtId); }
    public Block createBlock(Block block) { return blockRepository.save(block); }

    public List<Panchayat> getPanchayatsByBlock(Long blockId) { return panchayatRepository.findByBlockId(blockId); }
    public Panchayat createPanchayat(Panchayat panchayat) { return panchayatRepository.save(panchayat); }

    public List<Village> getVillagesByPanchayat(Long panchayatId) { return villageRepository.findByPanchayatId(panchayatId); }
    public Village createVillage(Village village) { return villageRepository.save(village); }
}

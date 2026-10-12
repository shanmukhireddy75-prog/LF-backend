
package com.campus.lostfound.claim;

import com.campus.lostfound.item.Item;
import com.campus.lostfound.item.ItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:5173")
public class ClaimController {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;

    public ClaimController(
            ClaimRepository claimRepository,
            ItemRepository itemRepository) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Claim createClaim(@RequestBody Claim claim) {

        Item item = itemRepository.findById(claim.getItemId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Item not found"));

        if (!"FOUND".equalsIgnoreCase(item.getType())
                || !"OPEN".equalsIgnoreCase(item.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This item cannot be claimed");
        }

        if (claim.getClaimantName() == null
                || claim.getClaimantName().isBlank()
                || claim.getContact() == null
                || claim.getContact().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Name and contact are required");
        }

        claim.setId(null);
        claim.setStatus("PENDING");

        return claimRepository.save(claim);
    }

    @GetMapping
    public List<Claim> getClaims() {
        return claimRepository.findAll();
    }
}

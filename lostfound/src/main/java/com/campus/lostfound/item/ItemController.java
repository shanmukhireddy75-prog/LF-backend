
package com.campus.lostfound.item;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    private final ItemRepository itemRepository;

    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @GetMapping
    public List<Item> getItems(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type) {

        List<Item> items;

        if (search != null && !search.isBlank()) {
            items = itemRepository
                    .findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                            search, search);
        } else {
            items = itemRepository.findAll();
        }

        if (type != null && !type.isBlank()) {
            items = items.stream()
                    .filter(item -> type.equalsIgnoreCase(item.getType()))
                    .toList();
        }

        return items;
    }

    @GetMapping("/{id}")
    public Item getItem(@PathVariable Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Item not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Item createItem(@RequestBody Item item) {
        if (item.getTitle() == null || item.getTitle().isBlank()
                || item.getType() == null
                || !(item.getType().equalsIgnoreCase("LOST")
                || item.getType().equalsIgnoreCase("FOUND"))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter an item title and type LOST or FOUND");
        }

        item.setType(item.getType().toUpperCase());
        return itemRepository.save(item);
    }

    @PutMapping("/{id}/status")
    public Item updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        if (!List.of("OPEN", "CLAIMED", "RETURNED", "CLOSED")
                .contains(status.toUpperCase())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid item status");
        }

        Item item = getItem(id);
        item.setStatus(status.toUpperCase());

        return itemRepository.save(item);
    }
}

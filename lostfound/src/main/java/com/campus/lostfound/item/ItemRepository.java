
package com.campus.lostfound.item;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String title, String category);

}

import sqlite3
import db

# Product descriptions by category
DESCRIPTIONS = {
    "Shampoo": [
        "Deeply cleanse and revitalize your hair with this premium shampoo. Formulated with natural botanical extracts to gently remove buildup while maintaining your hair's natural moisture balance. Perfect for daily use.",
        "Transform your hair care routine with this luxurious shampoo. Enriched with nourishing ingredients that strengthen hair from root to tip while providing a salon-quality clean. Suitable for all hair types.",
        "Experience the ultimate in hair care with this advanced formula shampoo. Specially designed to protect color-treated hair while delivering exceptional cleansing power and shine-enhancing benefits.",
    ],
    "Conditioner": [
        "Lock in moisture and enhance manageability with this rich, creamy conditioner. Infused with deep conditioning agents that penetrate the hair shaft to repair damage and prevent breakage.",
        "Restore softness and shine with this intensive conditioning treatment. Features a unique blend of proteins and vitamins that fortify each strand while detangling and smoothing the cuticle.",
        "Nourish and protect your hair with this premium conditioner. Formulated with natural oils and botanical extracts to provide long-lasting hydration and frizz control.",
    ],
    "Hair Mask": [
        "Revive damaged hair with this intensive repair mask. A powerful treatment that penetrates deeply to reconstruct hair fibers, restore elasticity, and bring back natural luster and vitality.",
        "Indulge in salon-quality care with this luxurious hair mask. Packed with nourishing ingredients that provide deep hydration and repair, leaving hair incredibly soft and manageable.",
        "Transform dry, brittle hair with this ultra-moisturizing mask. Formulated with advanced proteins and ceramides to strengthen and protect while delivering intense shine and smoothness.",
    ],
    "Hair Oil": [
        "Achieve silky, luminous hair with this lightweight oil blend. Absorbs quickly without greasiness, providing essential nutrients and protection against heat and environmental damage.",
        "Revitalize and protect your hair with this premium oil treatment. Rich in antioxidants and vitamins, it smooths frizz, adds brilliant shine, and prevents split ends.",
        "Nourish your hair from within with this concentrated oil formula. Penetrates deeply to repair damage, strengthen strands, and create a protective barrier against styling stress.",
    ],
    "Leave-In Treatment": [
        "Protect and perfect your hair throughout the day with this multi-benefit leave-in treatment. Provides heat protection, detangling, and UV defense while adding shine and reducing frizz.",
        "Simplify your hair care routine with this all-in-one leave-in formula. Strengthens, moisturizes, and shields hair from damage without weighing it down.",
        "Experience continuous care with this lightweight leave-in treatment. Infused with botanical extracts that work throughout the day to maintain moisture balance and enhance manageability.",
    ]
}

def add_descriptions():
    conn = db.get_db_connection()
    cursor = conn.cursor()
    
    # Get all products
    cursor.execute("SELECT id, name, category FROM products")
    products = cursor.fetchall()
    
    description_index = {}
    
    for product in products:
        product_id = product["id"]
        category = product["category"]
        name = product["name"]
        
        # Get category-specific descriptions
        if category in DESCRIPTIONS:
            # Use index to cycle through descriptions
            if category not in description_index:
                description_index[category] = 0
            
            desc_list = DESCRIPTIONS[category]
            description = desc_list[description_index[category] % len(desc_list)]
            description_index[category] += 1
        else:
            # Generic description
            description = f"Premium hair care product designed to deliver exceptional results. Formulated with high-quality ingredients to nourish, protect, and enhance your hair's natural beauty."
        
        # Update product with description
        cursor.execute("UPDATE products SET description = ? WHERE id = ?", (description, product_id))
        print(f"Updated: {name} - {description[:50]}...")
    
    conn.commit()
    conn.close()
    print(f"\n✅ Added descriptions to {len(products)} products")

if __name__ == "__main__":
    add_descriptions()

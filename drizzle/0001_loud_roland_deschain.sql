CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`order_number` text NOT NULL,
	`items` text NOT NULL,
	`subtotal` integer NOT NULL,
	`tax` integer NOT NULL,
	`discount` integer NOT NULL,
	`total` integer NOT NULL,
	`payment_method` text NOT NULL,
	`promo_code` text,
	`status` text DEFAULT 'received' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);
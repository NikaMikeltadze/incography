-- Add input validation constraints for content fields

-- Add length constraints for chat messages (max 5000 characters)
ALTER TABLE chat_messages
ADD CONSTRAINT chat_message_content_length_check
CHECK (length(content) > 0 AND length(content) <= 5000);

-- Add length constraints for posts (max 10000 characters for longer posts)
ALTER TABLE posts
ADD CONSTRAINT post_content_length_check
CHECK (length(content) > 0 AND length(content) <= 10000);

-- Add length constraints for bubble name and description
ALTER TABLE bubbles
ADD CONSTRAINT bubble_name_length_check
CHECK (length(name) > 0 AND length(name) <= 100);

ALTER TABLE bubbles
ADD CONSTRAINT bubble_description_length_check
CHECK (description IS NULL OR length(description) <= 500);

ALTER TABLE bubbles
ADD CONSTRAINT bubble_topic_length_check
CHECK (topic IS NULL OR length(topic) <= 100);
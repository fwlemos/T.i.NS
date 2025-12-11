DO $$
DECLARE
    test_contact_id uuid;
    audit_record record;
    user_id_val uuid;
BEGIN
    -- get a user id
    select id into user_id_val from auth.users limit 1;

    -- 1. Insert Test Contact
    INSERT INTO contacts (name, email, created_by)
    VALUES ('Audit Test Contact', 'audit@test.com', user_id_val)
    RETURNING id INTO test_contact_id;
    
    RAISE NOTICE 'Inserted Contact ID: %', test_contact_id;

    -- 2. Update Test Contact (change name only)
    UPDATE contacts 
    SET name = 'Audit Test Contact Updated'
    WHERE id = test_contact_id;

    -- 3. Check Audit Log for UPDATE
    SELECT * INTO audit_record 
    FROM audit_logs 
    WHERE entity_id = test_contact_id AND action = 'UPDATE';
    
    RAISE NOTICE 'Audit Record Changes: %', audit_record.changes;
    
    -- 4. Clean up
    DELETE FROM contacts WHERE id = test_contact_id; -- This will also trigger a DELETE audit log
    DELETE FROM audit_logs WHERE entity_id = test_contact_id; -- Clean up logs
    
END $$;

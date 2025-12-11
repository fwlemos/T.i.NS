import { supabase } from '@/lib/supabase/client';

export async function checkContractExpirations(): Promise<void> {
    // Threshold: 60 days
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + 60);
    const thresholdDateStr = thresholdDate.toISOString().split('T')[0];

    // Current date
    const todayStr = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('companies')
        .select('id, name, contract_validity, contract_file_id')
        .eq('type', 'manufacturer')
        .lte('contract_validity', thresholdDateStr)
        .gte('contract_validity', todayStr); // Future expirations only? Or include past too?
    // Usually we want to alert on Expired AND Expiring Soon. 
    // So .lte(...) and maybe check if already notified?
    // For simple UI display (e.g. badge), we just query.

    if (error) {
        console.error('Error checking contract expirations:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log(`Found ${data.length} expiring contracts (within 60 days):`, data);
        // In a real system, create notification records or email.
        // For this demo, we just log.
    }
}

export async function getExpiringContracts() {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    // We want contracts > today AND <= 60 days from now (Expiring Soon)
    // AND contracts < today (Expired)
    // So basically contract_validity < 60 days from now.

    const { data, error } = await supabase
        .from('companies')
        .select('id, name, contract_validity')
        .eq('type', 'manufacturer')
        .lte('contract_validity', thresholdDate.toISOString());

    if (error) return [];
    return data;
}

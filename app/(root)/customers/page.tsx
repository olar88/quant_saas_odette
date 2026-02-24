import { getCustomers } from "@/lib/actions/customers";
import { AddCustomerButton } from "@/components/customers/AddCustomerModal";
import { CustomerListClient } from "@/components/customers/CustomerListClient";

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <CustomerListClient
            customers={customers}
            addCustomerButton={<AddCustomerButton />}
        />
    );
}

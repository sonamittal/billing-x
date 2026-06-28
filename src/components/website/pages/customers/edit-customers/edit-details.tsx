import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import EditBillingAddressForm from "@/components/website/pages/customers/edit-customers/edit-billing-address-form";
import ContactPersonTable from "@/components/website/pages/customers/edit-customers/contact-person";
import OtherDetailsForm from "@/components/website/pages/customers/edit-customers/other-details";
import EditRemark from "@/components/website/pages/customers/edit-customers/edit-remark";
import type { GetCustomerById } from "@/app/api/panel/customers/[customerId]/type";

const EditDetails = ({
  customer,
  callback,
}: {
  customer: GetCustomerById;
  callback?: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit customer details</CardTitle>
        <CardDescription>
          Modify customer details including address, contact person, remarks,
          and other relevant information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="other">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="flex  items-center gap-5">
              <TabsTrigger value="other">Other Details</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="contact">Contact Persons</TabsTrigger>
              <TabsTrigger value="remarks">Remarks</TabsTrigger>
            </TabsList>
          </div>

          {/* Other Details */}
          <TabsContent value="other" className="mt-4">
            <div className="space-y-4">
              <OtherDetailsForm
                customerId={customer?.id}
                customer={customer}
                callback={callback}
              />
            </div>
          </TabsContent>

          {/* Address */}
          <TabsContent value="address" className="mt-7">
            <div className="grid lg:grid-cols-1 gap-6">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-9 w-9 text-green-600 bg-green-100 rounded-md p-1.5" />
                  <div>
                    <h2 className="font-medium text-lg">Billing Address</h2>
                    <h4 className="text-sm font-normal text-gray-500">
                      Primary billing address
                    </h4>
                  </div>
                </div>
                <EditBillingAddressForm
                  customerId={customer.id}
                  customer={customer}
                  callback={callback}
                />
              </div>
              {/* <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-9 w-9 text-green-600 bg-green-100 rounded-md p-1.5" />
                  <div>
                    <h2 className="font-medium text-lg">Shipping Address</h2>
                    <h4 className="text-sm font-normal text-gray-500">
                      Copy billing address
                    </h4>
                  </div>
                </div>
                <EditShippingAddressForm />
              </div> */}
            </div>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact" className="mt-4">
            <div className="space-y-4">
              <ContactPersonTable
                callback={callback}
                customerId={customer?.id}
              />
            </div>
          </TabsContent>

          {/* Remarks */}
          <TabsContent value="remarks" className="mt-4">
            <div className="space-y-4">
              <EditRemark
                customerId={customer?.id}
                customer={customer}
                callback={callback}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EditDetails;

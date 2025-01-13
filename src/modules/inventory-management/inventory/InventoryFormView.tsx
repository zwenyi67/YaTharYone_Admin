import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CircleChevronLeft } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { AddInventoryPayloadType, UpdateInventoryPayloadType } from '@/api/inventory/types';
import { t } from 'i18next';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  unit_of_measure: z.string().min(1, {
    message: "Unit of Measure is required.",
  }),
  current_stock: z.number({
    required_error: "Current Stock is required.",
  }),
  min_stock_level: z.number({
    required_error: "Min Stock Level is required.",
  }),
  reorder_level: z.number({
    required_error: "Reorder Level is required.",
  }),
  description: z.string().optional(),
  createby: z.number().optional(), // Assuming this is optional for the form
});

export default function InventoryFormView() {

  const navigate = useNavigate();


  const location = useLocation();
  const { id } = useParams();

  const passedData = location.state?.data;

  const item: AddInventoryPayloadType = id
    ? { ...passedData }
    : {
      name: "",
      unit_of_measure: "",
      current_stock: 0,
      min_stock_level: 0,
      reorder_level: 0,
      description: "",
      createby: 1,
    };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      unit_of_measure: item?.unit_of_measure || "",
      current_stock: item?.current_stock || 0,
      min_stock_level: item?.min_stock_level || 0,
      reorder_level: item?.reorder_level || 0,
      description: item?.description || "",
      createby: item?.createby || 1,
    },
  });

  const { mutate: addInventory } =
    api.inventory.addInventory.useMutation({
      onSuccess: () => {
        toast({
          title: "New Inventory added successfully",
          variant: "success",
        });
        navigate("/inventory-management/inventories");
      },
      onError: (error) => {
        form.setError("name", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: updateInventory } =
    api.inventory.updateInventory.useMutation({
      onSuccess: () => {
        toast({
          title: "Inventory updated successfully",
          variant: "success",
        });
        navigate("/inventory-management/inventories");
      },
      onError: (error) => {
        form.setError("name", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    try {
      // Format dates and create FormData
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("unit_of_measure", item.unit_of_measure.toString());
      formData.append("current_stock", item.current_stock.toString());
      formData.append("min_stock_level", item.min_stock_level.toString());
      formData.append("reorder_level", item.reorder_level.toString());
      formData.append("description", item.description || '');

      if (id) {
        // For edit form
        formData.append("updateby", (item.createby || 1).toString());
        formData.append("id", id);

        // Call update API
        await updateInventory(formData as unknown as UpdateInventoryPayloadType);
      } else {
        // For add form
        formData.append("createby", (item.createby || 1).toString());

        // Call add API
        await addInventory(formData as unknown as AddInventoryPayloadType);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="m-4">
      <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
        {t("title.inventory-management")}
      </div>
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/inventory-management/inventories'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            {id ? "Edit Inventory Item" : "Add New Inventory Item"}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-6 mt-5'>
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Inventory Name <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Unit Of Measure */}
              <FormField
                control={form.control}
                name="unit_of_measure"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Unit Of Measure <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="eg, kg, g, li" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Current Stock */}
              <FormField
                control={form.control}
                name="current_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input
                      type="number" 
                      placeholder="Current Stock"
                      onChange={(e) => field.onChange(Number(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Min Stock Level */}
              <FormField
                control={form.control}
                name="min_stock_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Stock Level <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input
                      type="number" 
                      placeholder="Min Stock Level"
                      onChange={(e) => field.onChange(Number(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Reorder Level */}
              <FormField
                control={form.control}
                name="min_stock_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reorder Level <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input 
                      type="number"
                      placeholder="Reorder Level"
                      onChange={(e) => field.onChange(Number(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <button type="submit" className="bg-secondary rounded-sm p-2 px-6 text-white mt-7">
                {id ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </section >
  )
}

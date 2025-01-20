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
import { t } from 'i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from '@/components/ui/datepicker';
import { AddMenuCategoryPayloadType, GetMenuCategoriesType, UpdateMenuCategoryPayloadType } from '@/api/menu-category/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  unit_of_measure: z.string().min(1, {
    message: "Unit of Measure is required.",
  }),
  current_stock: z
    .union([
      z.number({
        required_error: "Current Stock is required.",
      }),
      z.string({
        required_error: "Current Stock is required.",
      }).regex(/^\d+(\.\d+)?$/, "Current Stock must be a positive number or decimal string."),
    ])
    .refine((value) => Number(value) > 0, {
      message: "Current Stock must be a positive number.",
    }),
  min_stock_level: z
    .union([
      z.number({
        required_error: "Min Stock Level is required.",
      }),
      z.string({
        required_error: "Min Stock Level is required.",
      }).regex(/^\d+(\.\d+)?$/, "Min Stock Level must be a positive number or decimal string."),
    ])
    .refine((value) => Number(value) > 0, {
      message: "Min Stock Level must be a positive number.",
    }),
  reorder_level: z
    .union([
      z.number({
        required_error: "Reorder Level is required.",
      }),
      z.string({
        required_error: "Reorder Level is required.",
      }).regex(/^\d+(\.\d+)?$/, "Reorder Level must be a positive number or decimal string."),
    ])
    .refine((value) => Number(value) > 0, {
      message: "Reorder Level must be a positive number.",
    }),
  is_perishable: z.boolean().optional(),
  expiry_date: z.date({
    required_error: "Expiry date is required.",
  }),
  item_category_id: z.string().min(1, {
    message: "Menu Category is required.",
  }),
  description: z.string().optional(),
  createby: z.number().optional(), // Assuming this is optional for the form
});

export default function MenuCategoryFormView() {

  const navigate = useNavigate();

  const { data, isFetching } = api.menuCategory.getMenuCategories.useQuery();

  const location = useLocation();
  const { id } = useParams();

  const passedData: AddMenuCategoryPayloadType = location.state?.data;

  const item: AddMenuCategoryPayloadType = id
    ? { ...passedData }
    : {
      name: "",
      description: "",
      createby: 1,
    };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      createby: item?.createby || 1,
    },
  });

  const { mutate: addCategory } =
    api.menuCategory.addMenuCategory.useMutation({
      onSuccess: () => {
        toast({
          title: "New Category added successfully",
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

  const { mutate: updateCategory } =
    api.menuCategory.updateMenuCategory.useMutation({
      onSuccess: () => {
        toast({
          title: "Category updated successfully",
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
      formData.append("is_perishable", item.is_perishable ? '1' : '0');
      formData.append("expiry_date", item.expiry_date.toISOString().split("T")[0]);
      formData.append("item_category_id", item.item_category_id.toString());
      formData.append("reorder_level", item.reorder_level.toString());
      formData.append("description", item.description || '');

      if (id) {
        // For edit form
        formData.append("updateby", (item.createby || 1).toString());
        formData.append("id", id);

        // Call update API
        await updateCategory(formData as unknown as UpdateMenuCategoryPayloadType);
      } else {
        // For add form
        formData.append("createby", (item.createby || 1).toString());

        // Call add API
        await addCategory(formData as unknown as AddMenuCategoryPayloadType);
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
            {id ? "Edit Category Item" : "Add New Category Item"}
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
                    <FormLabel>Category Name <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
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
                      <Select
                        onValueChange={(value) => field.onChange(value)} // Update form state
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="g">Gram (g)</SelectItem>
                          <SelectItem value="lb">Pound (lb)</SelectItem>
                          <SelectItem value="oz">Ounce (oz)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*Item Category */}
              <FormField
                control={form.control}
                name="item_category_id"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Item Category <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)} defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isFetching ? 'Loading' : 'Select Category'} />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.map((cate: GetMenuCategoriesType) => (
                            <SelectItem key={cate.id} value={cate.id.toString()}>{cate.name}</SelectItem>
                          ))}

                        </SelectContent>
                      </Select>
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
                        value={form.getValues("current_stock")}
                        type="number"
                        placeholder="Current Stock"
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
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
                        value={form.getValues("min_stock_level")}
                        type="number"
                        placeholder="Min Stock Level"
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Reorder Level */}
              <FormField
                control={form.control}
                name="reorder_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reorder Level <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        value={form.getValues("reorder_level")}
                        type="number"
                        placeholder="Reorder Level"
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Expiry Date */}
              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={(date) => field.onChange(date)} />
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

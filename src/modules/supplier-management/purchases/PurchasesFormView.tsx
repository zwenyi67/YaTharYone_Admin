import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Link, useParams } from 'react-router-dom';
import { CircleChevronLeft } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetItemCategoriesType } from '@/api/inventory/types';
import { AddPurchaseItemPayloadType, ConfirmPurchaseItemsPayloadType, GetItemType } from '@/api/purchase-item/types';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cross2Icon } from '@radix-ui/react-icons';


const formSchema = z.object({
  item_category_id: z.string().min(1, {
    message: "Item Category is required.",
  }),
  item_id: z.string().min(1, {
    message: "Item is required.",
  }),
  unit_cost: z.union([
    z.string(),
    z.number()
  ])
    .transform((value) => {
      if (typeof value === 'string' && !isNaN(Number(value))) {
        return Number(value);
      }
      return value; // No transformation for already a number
    })
    .refine((value) => {
      return typeof value === 'number' && value >= 0.01;
    }, { message: "Unit cost must be greater than 0." }),

  quantity: z.union([
    z.string(),
    z.number()
  ])
    .transform((value) => {
      if (typeof value === 'string' && !isNaN(Number(value))) {
        return Number(value);
      }
      return value;
    })
    .refine((value) => {
      return typeof value === 'number' && value >= 1;
    }, { message: "Quantity must be greater than 0." }),
});

export default function PurchasesFormView() {

  const navigate = useNavigate();

    const { id : supplier_id } = useParams();

  const item: AddPurchaseItemPayloadType = {
    item_category_id: "",
    item_id: "",
    item_name: "",
    unit_of_measure: "",
    unit_cost: "",
    quantity: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_category_id: item?.item_category_id.toString() || "",
      item_id: item?.item_id.toString() || "",
      unit_cost: item?.unit_cost || "",
      quantity: item?.quantity || "",
    },
  });

  const { data: cates, isFetching: isCateFetching } = api.inventory.getItemCategories.useQuery();

  const itemCategoryId = useWatch({
    control: form.control,
    name: "item_category_id", // Field to watch
  });

  const unit = useWatch({
    control: form.control,
    name: "item_id"
  })
  const unitOnly = unit ? unit.split(',')[2]?.trim() : '';

  const { data: items, isFetching: isItemFetching } = api.purchaseItem.getItems.useQuery(itemCategoryId);

  const [purchases, SetPurchases] = useState<AddPurchaseItemPayloadType[]>([]);


  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    try {
      const [id, name, unit] = (item.item_id as string).split(',');
      const newPurchaseItem: AddPurchaseItemPayloadType = {
        item_id: id.trim(), // or parseInt(id.trim()) if id is numeric
        item_name: name.trim(),
        unit_of_measure: unit.trim(),
        item_category_id: item.item_category_id,
        unit_cost: item.unit_cost,
        quantity: item.quantity,
      };
      SetPurchases((prevPurchases: AddPurchaseItemPayloadType[]) => {
        const existingItemIndex = prevPurchases.findIndex((p) => p.item_id === newPurchaseItem.item_id);

        if (existingItemIndex !== -1) {
          // Item exists, update quantity
          const updatedPurchases = [...prevPurchases];
          updatedPurchases[existingItemIndex] = {
            ...updatedPurchases[existingItemIndex],
            quantity: updatedPurchases[existingItemIndex].quantity + newPurchaseItem.quantity,
          };
          return updatedPurchases;
        }

        // Item does not exist, add as a new purchase
        return [...prevPurchases, newPurchaseItem];
      });
      form.reset({
        item_category_id: "",
        item_id: "",
        unit_cost: "",
        quantity: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const removeItem = (purchase: AddPurchaseItemPayloadType) => {
    SetPurchases((prevPurchases: AddPurchaseItemPayloadType[]) =>
      prevPurchases.filter((item) => item.item_id !== purchase.item_id)
    );
  };

  useEffect(() => {
    if (itemCategoryId) {
      form.setValue("item_id", ""); // Reset item_id to empty
    }
  }, [itemCategoryId, form]);

  useEffect(() => {
  }, [purchases]);

  const { mutate: confirmPurchases } =
    api.purchaseItem.confirmPurchases.useMutation({
      onSuccess: () => {
        toast({
          title: "New Purchase Transaction added successfully",
          variant: "success",
        });
        navigate("/supplier-management/purchasehistories");
      },
      onError: (error) => {
        //form.setError("name", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const confirmPurchase = () => {
    console.log("clicking");
    const payload = {
      purchase_items: purchases,
      supplier_id: supplier_id,
      total_amount: 1000,
      purchase_note: "Hello purchase",
    }
    confirmPurchases(payload as ConfirmPurchaseItemsPayloadType);
  }

  const cancelPurchase = () => {
    SetPurchases([]);
  }

  return (
    <section className="m-4">
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/supplier-management/purchasehistories'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            Purchsing Item List
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-7 gap-6 mt-5'>
              {/*Item Category */}
              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name="item_category_id"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Item Category <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isCateFetching ? 'Loading' : 'Select Category'} />
                          </SelectTrigger>
                          <SelectContent>
                            {cates?.map((cate: GetItemCategoriesType) => (
                              <SelectItem key={cate.id} value={cate.id.toString()}>{cate.name}</SelectItem>
                            ))}

                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Item Name */}
              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name="item_id"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Item Name <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Select disabled={!itemCategoryId} value={field.value}
                          onValueChange={(value) => field.onChange(value)} defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isItemFetching ? 'Loading' : ''} />
                          </SelectTrigger>
                          <SelectContent>
                            {items?.map((item: GetItemType) => (
                              <SelectItem key={item.id} value={`${item.id.toString()},${item.name},${item.unit_of_measure}`}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Unit of Measure */}
              <div>
                <div className="">
                  <FormLabel>Unit</FormLabel>
                  <Input disabled placeholder={unitOnly} />
                </div>
              </div>
              {/* Unit Cost */}
              <div>
                <FormField
                  control={form.control}
                  name="unit_cost"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Unit Cost <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Quantity */}
              <div>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Quantity <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <button type="submit" className="bg-secondary rounded-sm p-2 px-6 text-white mt-5">
                Submit
              </button>
            </div>
          </form>
        </Form>

        <div className='flex justify-center mt-10 p-5'>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >
                </TableHead>
                <TableHead >No</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Unit of Measure</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => (
                  <>
                    <TableRow key={purchase.item_id}>
                      <TableCell><button onClick={() => removeItem(purchase)} className='bg-primary hover:bg-red-500 rounded-full p-1 text-white'><Cross2Icon className='h-3 w-3' /></button></TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{purchase.item_name}</TableCell>
                      <TableCell>{purchase.unit_of_measure}</TableCell>
                      <TableCell>${purchase.unit_cost}</TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell>${purchase.unit_cost * purchase.quantity}</TableCell>
                    </TableRow>
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}

              {purchases.length > 0 && (
                <>
                  <TableRow>
                    <TableCell colSpan={6}>Total Amount</TableCell>
                    <TableCell>
                      ${purchases.reduce((total, purchase) => total + (purchase.unit_cost * purchase.quantity), 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <button onClick={cancelPurchase} className='bg-primary hover:bg-red-500 text-white p-2 px-4 rounded-sm'>Cancel</button>
                    </TableCell>
                    <TableCell>
                      <button onClick={confirmPurchase} className='bg-secondary hover:bg-blue-500 text-white p-2 px-4 rounded-sm'>Confirm</button>
                    </TableCell>
                  </TableRow>
                </>
              )}

            </TableBody>
          </Table>

        </div>
      </div>
    </section >
  )
}

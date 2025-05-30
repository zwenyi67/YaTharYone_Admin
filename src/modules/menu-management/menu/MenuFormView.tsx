import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CircleChevronLeft, PencilRuler, PlusCircleIcon } from 'lucide-react';
import api from '@/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { AddMenuPayloadType, GetMenuCategoriesType, IngredientType, UpdateMenuPayloadType } from '@/api/menu/types';
import { t } from 'i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDispatch } from 'react-redux';
import { hideLoader, openLoader } from '@/store/features/loaderSlice';
import { GetItemCategoriesType } from '@/api/inventory/types';
import FormHeader from '@/components/common/FormHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cross2Icon } from '@radix-ui/react-icons';
import UnitConverter from '@/components/common/UnitConverter';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Menu name must be at least 2 characters.",
  }),
  menu_category_id: z.string().min(1, {
    message: "Menu Category is required.",
  }),
  profile: z
    .union([
      z.string().optional(),
      z
        .instanceof(File)
        .refine(
          (file) =>
            ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
          {
            message: "Only PNG, JPG, or JPEG files are allowed.",
          }
        ),
    ])
    .optional(),
  description: z.string().optional(),
  price: z.union([
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
  createby: z.number().optional(),
});

export default function MenuFormView() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { data: cates, isFetching: isCateFetching, refetch } = api.menu.getMenuCategories.useQuery();

  const location = useLocation();
  const { id } = useParams();

  const passedData = location.state?.data;

  const menu: AddMenuPayloadType = id
    ? { ...passedData }
    : {
      name: "",
      profile: undefined,
      category_id: undefined,
      price: undefined,
      description: "",
      createby: 1,
    };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: menu?.name || "",
      profile: menu?.profile,
      description: menu?.description || "",
      price: menu?.price || "",
      createby: menu?.createby || 1,
    },
  });

  const { data: itemCates } = api.inventory.getItemCategories.useQuery();

  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemData, setItemData] = useState('');
  const [itemName, setItemName] = useState('');
  const [unitOnly, setUnitOnly] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');

  useEffect(() => {
    // Reset to default values when no category is selected
    setItemId("");
    setItemData("");
    setItemName("");
    setUnitOnly("");
    setQuantity("");

  }, [itemCategoryId]);

  const { data: items } = api.purchaseItem.getItems.useQuery(itemCategoryId);

  const [ingredients, setIngredients] = useState<IngredientType[]>([]);

  const [showConverter, setShowConverter] = useState<boolean>(false);

  const addIngredient = () => {
    if (itemCategoryId && itemId && quantity) {
      const newPurchaseItem: IngredientType = {
        item_id: itemId,
        item_name: itemName,
        unit_of_measure: unitOnly,
        item_category_id: itemCategoryId,
        quantity: quantity,
      };
      setIngredients((prev: IngredientType[]) => {
        const existingItemIndex = prev.findIndex((p) => p.item_id === newPurchaseItem.item_id);

        if (existingItemIndex !== -1) {
          // Item exists, update quantity
          const updatedPurchases = [...prev];
          updatedPurchases[existingItemIndex] = {
            ...updatedPurchases[existingItemIndex],
            quantity: updatedPurchases[existingItemIndex].quantity + newPurchaseItem.quantity,
          };
          return updatedPurchases;
        }
        return [...prev, newPurchaseItem];
      });
      // Reset form inputs
      setItemCategoryId('');
      setItemId('');
      setItemData('');
      setUnitOnly('');
      setQuantity('');
    }
  };

  const removeItem = (item: IngredientType) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.item_id !== item.item_id)
    );
  }

  const { mutate: addMenu } =
    api.menu.addMenu.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSuccess: () => {
        toast({
          title: "New Menu added successfully",
          variant: "success",
        });
        navigate("/menu-management/menus");
      },
      onError: (error) => {
        form.setError("name", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        dispatch(hideLoader());
      },
    });

  const { mutate: updateMenu } =
    api.menu.updateMenu.useMutation({
      onSuccess: () => {
        toast({
          title: "Menu updated successfully",
          variant: "success",
        });
        navigate("/menu-management/menus");
      },
      onError: (error) => {
        form.setError("name", { type: "custom", message: error.message });
        toast({
          title: error.message,
          variant: "destructive",
        });
      },
    });

  const onSubmit = async (menu: z.infer<typeof formSchema>) => {
    try {
      if (ingredients.length > 0) {
        // Format dates and create FormData
        const formData = new FormData();
        formData.append("name", menu.name);

        // Handle profile based on whether it's a file or an existing URL
        const profile = form.getValues("profile");
        if (profile instanceof File) {
          formData.append("profile", profile); // Append the new file
        } else if (id && menu.profile) {
          formData.append("profile", menu.profile); // Append the existing profile URL
        }

        formData.append("category_id", menu.menu_category_id);
        formData.append("description", menu.description || '');
        formData.append("price", menu.price.toString());
        formData.append("ingredients", JSON.stringify(ingredients));

        if (id) {
          formData.append("updateby", (menu.createby || 1).toString());
          formData.append("id", id);

          await updateMenu(formData as unknown as UpdateMenuPayloadType);
        } else {
          formData.append("createby", (menu.createby || 1).toString());

          await addMenu(formData as unknown as AddMenuPayloadType);
        }
      } else {
        toast({
          title: "Please Add Ingredients",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (id && menu.profile) {
      const fileUrl = "http://127.0.0.1:8000" + menu.profile;
      setPreview(fileUrl); // Set the preview to the existing profile URL
      //form.setValue("profile", null); // Do not set the profile as a File yet
    }
  }, [id, menu.profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Only PNG, JPG, or JPEG files are allowed.");
        setPreview(preview); // Keep the existing preview
        return;
      }

      setFileError(null);
      form.setValue("profile", file); // Set the file in the form state
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string); // Show preview as base64 URL
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="m-4 overflow-hidden">
      <FormHeader
        title={t("title.menu-management")}
        onRefresh={() => refetch()}
        isLoading={isCateFetching}
      />
      <div className="p-6 bg-white rounded-lg">
        <div className='flex mb-8'>
          <div className='me-5'>
            <Link to={'/menu-management/menus'}>
              <CircleChevronLeft className='w-8 h-8 text-secondary hover:text-blue-500' />
            </Link>
          </div>
          <div className='text-base font-semibold mt-1 text-secondary'>
            {id ? "Edit Menu" : "Add New Menu"}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="profilePhoto"
                className="flex h-48 w-48 cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 bg-gray-50 text-gray-500 hover:border-blue-500 hover:text-blue-500"
                style={{
                  backgroundImage: preview ? `url(${preview})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!preview && <span className="text-center">Click to upload Profile</span>}
              </label>
              <input
                type="file"
                id="profilePhoto"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                className="hidden"
              />
              {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
            </div>
            <div className='grid grid-cols-2 gap-6 mt-5'>
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Menu Name <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Menu Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={form.control}
                name="menu_category_id"
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
                          {cates?.map((cate: GetMenuCategoriesType) => (
                            <SelectItem key={cate.id} value={cate.id.toString()}>{cate.name}</SelectItem>
                          ))}

                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price<span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        value={form.getValues("price")}
                        type="number"
                        placeholder="Price"
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
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
                    <FormLabel>Description <span className='text-primary font-extrabold text-base'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <UnitConverter showConverter={showConverter} setShowConverter={setShowConverter} />

            <div className='mt-10'>
              <div className='text-secondary font-semibold flex'>
                <h1>Ingredient</h1>
                <button type='button' className='ms-auto' onClick={() => setShowConverter(true)}>
                  <PencilRuler className='w-6 h-6 text-secondary hover:text-blue-500' />
                </button>
              </div>
              <div>
                <div className="grid grid-cols-7 gap-6 mt-5">
                  {/* Item Category */}
                  <div className="col-span-2">
                    <label className="text-charcoal font-medium text-sm">
                      Item Category <span className="text-primary font-extrabold text-base">*</span>
                    </label>
                    <select
                      className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-accent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={itemCategoryId}
                      onChange={(e) => setItemCategoryId(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {itemCates?.map((cate: GetItemCategoriesType) => (
                        <option key={cate.id} value={cate.id}>
                          {cate.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Name */}
                  <div className="col-span-2">
                    <label className="text-charcoal font-medium text-sm">
                      Item Name <span className="text-primary font-extrabold text-base">*</span>
                    </label>
                    <select
                      className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-accent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={itemData}
                      onChange={(e) => {
                        const [id, name, unit] = e.target.value.split(',');
                        setItemData(e.target.value);
                        setItemId(id);
                        setUnitOnly(unit);
                        setItemName(name);
                      }}
                      disabled={!itemCategoryId}
                    >
                      <option value="">Select Item</option>
                      {items?.map((item) => (
                        <option key={item.id} value={`${item.id},${item.name},${item.unit_of_measure}`}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Unit of Measure */}
                  <div>
                    <label className="text-charcoal font-medium text-sm">Unit</label>
                    <div className="text-charcoal font-medium text-sm pt-2">
                      {itemData ? unitOnly : ''}
                    </div>
                  </div>
                  {/* Quantity */}
                  <div>
                    <label className="text-charcoal font-medium text-sm">
                      Quantity <span className="text-primary font-extrabold text-base">*</span>
                    </label>
                    <input
                      type="number"
                      className="flex h-9 w-full rounded-md bg-accent px-3 py-1 file:rounded border text-sm transition-colors file:bg-transparent file:hover:bg-gray-300 file:h-full file:text-xs file:cursor-pointer placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50 auto"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  {/* Add Button */}
                  <div>
                    <button
                      onClick={addIngredient}
                      className="mt-7 text-secondary font-bold rounded hover:bg-secondary-dark"
                      type='button'
                    >
                      <PlusCircleIcon className='w-7 h-7' />
                    </button>
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="mt-5">
                  {ingredients.length > 0 ? (
                    <Table className='w-[500px]'>
                      <TableHeader>
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead>#</TableHead>
                          <TableHead className="w-[50%]">Item Name</TableHead>
                          <TableHead>Portion Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ingredients.map((ingredient, index) => (
                          <TableRow key={index}>
                            <TableCell className="w-10 text-center">
                              <button
                                type='button'
                                onClick={() => removeItem(ingredient)}
                                className="bg-red-500 hover:bg-red-600 transition-all rounded-full p-1 text-white"
                              >
                                <Cross2Icon className="h-3 w-3" />
                              </button>
                            </TableCell>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{ingredient.item_name}</TableCell>
                            <TableCell>{ingredient.quantity} {ingredient.unit_of_measure}</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>No ingredients added yet.</p>
                  )}
                </div>
              </div>
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

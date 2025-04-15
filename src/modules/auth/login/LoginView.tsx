import api from "@/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, {
    message: "Password must contain at least 4 characters.",
  }),
});

const LoginView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { toast } = useToast();
  const { userLogin } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginUser } = api.auth.loginMutation.useMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: (data) => {
      console.log(data.token);
      userLogin(data.token);

      const routeToRedirect = location.state?.from
        ? location.state.from.pathname
        : "/";
      navigate(routeToRedirect, { replace: true });

      toast({
        title: `${t("success-title.login")} ${form.getValues().email}`,
        description: t("success-msg.login"),
        variant: "success",
      });
    },
    onError: (error) => {
      console.error("Error during login:", error);

      toast({
        title: t("error-title.login"),
        description: t("error-msg.login"),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    loginUser(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white">
      <div className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-md px-8 py-10 flex flex-col gap-6 items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/favicon.png"
            alt="YaTharYone Logo"
            className="mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide ms-2 pb-1">YaTharYone</h1>
        </div>
        <div className="text-gray-600 text-xl font-semibold">
          Admin Panel
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-secondary hover:bg-secondary active:bg-secondary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginView;

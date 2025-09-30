
"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBusinessProfile, saveBusinessProfile, BusinessProfile, seedBusinessProfile } from "@/services/business";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function BusinessProfilePage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileData = await getBusinessProfile("Acme Inc.");
        if (profileData) {
          setProfile(profileData);
        } else {
            // If no profile, seed and fetch again
            await seedBusinessProfile();
            const seededProfile = await getBusinessProfile("Acme Inc.");
            setProfile(seededProfile);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil de la empresa.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => (prev ? { ...prev, [name]: value } : null));
  };
  
  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
     setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        theme: {
          ...prev.theme,
          [colorType]: value,
        },
      };
    });
  }

  const handleSaveChanges = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await saveBusinessProfile(profile);
      toast({
        title: "Éxito",
        description: "El perfil de la empresa ha sido guardado.",
      });
      // Here you would typically trigger a theme update globally
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Archivo seleccionado:", file.name);
      // NOTE: Here you would typically upload the file to a storage service
      // like Firebase Storage and then update the profile's logoUrl.
      toast({
        title: "Logo Seleccionado",
        description: `${file.name} - La subida real no está implementada en este prototipo.`,
      });
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <p>No se encontró el perfil de la empresa.</p>;
  }

  return (
    <>
      <PageHeader
        title="Perfil de Empresa"
        description="Gestiona la información y la apariencia de tu negocio."
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Negocio</CardTitle>
            <CardDescription>
              Estos datos se utilizarán en facturas, recibos y comunicaciones.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Negocio</Label>
              <Input id="name" name="name" value={profile.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">RNC</Label>
              <Input id="taxId" name="taxId" value={profile.taxId} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" name="address" value={profile.address} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Logo</CardTitle>
                <CardDescription>Sube el logo de tu empresa. Se recomienda un archivo PNG transparente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    {profile.logoUrl ? (
                        <img src={profile.logoUrl} alt="Logo" className="h-16 w-16 object-contain rounded-md bg-muted p-1" />
                    ) : (
                        <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                            <span>Logo</span>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        className="hidden"
                        accept="image/png, image/jpeg, image/svg+xml"
                    />
                    <Button variant="outline" onClick={handleLogoButtonClick}>
                        <Upload className="mr-2 h-4 w-4" /> 
                        Subir Logo
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personalización del Tema</CardTitle>
            <CardDescription>Ajusta los colores para que coincidan con la identidad de tu marca. Usa valores HSL (ej: 263 44% 56%).</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
             <div className="space-y-2">
                <Label htmlFor="primaryColor">Color Primario</Label>
                <Input id="primaryColor" value={profile.theme.primary} onChange={(e) => handleColorChange('primary', e.target.value)} />
             </div>
             <div className="space-y-2">
                <Label htmlFor="secondaryColor">Color Secundario</Label>
                <Input id="secondaryColor" value={profile.theme.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} />
             </div>
             <div className="space-y-2">
                <Label htmlFor="accentColor">Color de Énfasis</Label>
                <Input id="accentColor" value={profile.theme.accent} onChange={(e) => handleColorChange('accent', e.target.value)} />
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </div>
      </div>
    </>
  );
}

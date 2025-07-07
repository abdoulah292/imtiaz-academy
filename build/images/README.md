# دليل تنظيم الصور

يتم تخزين جميع الصور في مجلد `public/images/` مع الهيكل التالي:

## الهيكل المقترح

```
public/
  images/
    logos/               # شعارات الموقع
      logo.png
    payment-methods/    # صور طرق الدفع
      vodafone-cash.png
      nbe-logo.png
      nbe-international.png
      housing-bank.png
```

## كيفية إضافة صور جديدة

1. ضع الصورة في المجلد المناسب حسب نوعها
2. استخدم الصورة في الكود كالتالي:

```jsx
// للصور الثابتة
<img 
  src={`${process.env.PUBLIC_URL}/images/path/to/your-image.png`} 
  alt="وصف الصورة"
  width="100"
  height="100"
/>

// للصور الديناميكية (إذا لزم الأمر)
function DynamicImage({ imageName }) {
  return (
    <img 
      src={`${process.env.PUBLIC_URL}/images/dynamic/${imageName}.png`} 
      alt={imageName}
    />
  );
}
```

## ملاحظات هامة

- استخدم تنسيق WebP للصور عندما يكون ذلك ممكنًا لتحسين الأداء
- تأكد من ضغط الصور قبل إضافتها للمشروع
- استخدم أسماء ملفات وصفيَّة باللغة الإنجليزية
- استخدم خاصية `alt` دائمًا لتحسين إمكانية الوصول (Accessibility)

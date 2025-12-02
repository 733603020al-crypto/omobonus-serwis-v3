# Анализ проблемы с изображениями в Outlook для Resend Email

## 1. Текущее состояние использования изображений

### Фон письма:
- **Путь в проекте:** `public/images/zmiety arkusz papieru 2.png`
- **Текущий URL в коде:** `https://www.omobonus.com.pl/images/zmiety%20arkusz%20papieru%202.png`
- **Использование:**
  - В CSS: `background-image: url('${backgroundImageUrl}')`
  - В VML для Outlook: `<v:fill type="frame" src="${backgroundImageUrl}" />`
- **Тип:** Абсолютный внешний URL

### Логотип:
- **Путь в проекте:** `public/images/Logo_Omobonus.png`
- **Текущий URL в коде:** `https://www.omobonus.com.pl/images/Logo_Omobonus.png`
- **Использование:** `<img src="https://www.omobonus.com.pl/images/Logo_Omobonus.png" />`
- **Тип:** Абсолютный внешний URL

## 2. Параметры изображений в HTML-шаблоне

### Фон (background-image):
```css
background-image: url('https://www.omobonus.com.pl/images/zmiety%20arkusz%20papieru%202.png');
background-size: cover;
background-position: center;
background-repeat: no-repeat;
```

**Параметры:**
- **src:** Абсолютный URL
- **Тип пути:** Абсолютный внешний URL (не относительный)
- **MIME-тип:** Не указан (определяется автоматически из расширения .png)
- **Кодирование:** URL-кодирование (`%20` вместо пробелов)
- **Base64:** НЕТ (внешняя ссылка)

### Логотип (img tag):
```html
<img src="https://www.omobonus.com.pl/images/Logo_Omobonus.png" 
     alt="Omobonus Serwis" 
     width="200" 
     height="auto" 
     style="max-width: 200px; height: auto; display: block; margin: 0 auto; border: 0; outline: none; text-decoration: none;" />
```

**Параметры:**
- **src:** Абсолютный URL
- **Тип пути:** Абсолютный внешний URL
- **MIME-тип:** Не указан (image/png определяется автоматически)
- **Base64:** НЕТ (внешняя ссылка)
- **CID (Content-ID):** НЕТ

### VML для Outlook (фон):
```xml
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="t" stroke="f" style="position:absolute;left:0;top:0;width:100%;height:100%;">
  <v:fill type="frame" src="https://www.omobonus.com.pl/images/zmiety%20arkusz%20papieru%202.png" color="transparent"/>
</v:rect>
```

**Параметры:**
- **src:** Абсолютный URL (в VML атрибуте)
- **type:** `frame` (заливка фреймом/изображением)
- **color:** `transparent` (запасной цвет)

## 3. Почему Outlook не отображает изображения

### Проблемы с текущим подходом:

1. **Блокировка внешних изображений:**
   - Outlook по умолчанию блокирует загрузку внешних изображений из соображений безопасности
   - Пользователь должен вручную разрешить загрузку изображений
   - Даже после разрешения, изображения могут не загружаться, если URL недоступен

2. **VML не всегда работает с внешними URL:**
   - VML в Outlook может не загружать изображения с внешних источников
   - Фоновые изображения через VML требуют, чтобы изображение было доступно в момент рендеринга

3. **Проблемы с доступностью URL:**
   - Если `https://www.omobonus.com.pl/images/...` недоступен или медленно загружается, Outlook покажет только запасной цвет (`transparent` → белый или серый)
   - Могут быть проблемы с CORS или сертификатами SSL

4. **Resend не встраивает изображения:**
   - Resend отправляет HTML как есть, без встраивания изображений
   - Изображения остаются внешними ссылками
   - Resend не преобразует их в base64 автоматически

## 4. Как Resend обрабатывает изображения

### Текущий способ (внешние URL):
- Resend отправляет HTML с внешними URL как есть
- Почтовые клиенты загружают изображения самостоятельно
- Проблема: Outlook блокирует такие изображения

### Альтернативные способы:

1. **Base64 inline:**
   ```html
   <img src="data:image/png;base64,iVBORw0KGgoAAAANS..." />
   ```
   - Изображение встроено в HTML
   - Работает везде, включая Outlook
   - Увеличивает размер письма

2. **CID attachments (Content-ID):**
   ```html
   <img src="cid:logo" />
   ```
   - Изображение как вложение с Content-ID
   - Resend поддерживает это через attachments с contentId
   - Работает в Outlook

3. **Внешние URL:**
   - Текущий подход
   - Не работает в Outlook без разрешения пользователя

## 5. Решение проблемы

### Рекомендуемое решение: Base64 встроенные изображения

**Преимущества:**
- ✅ Работает в Outlook без дополнительных действий
- ✅ Не требует внешних запросов
- ✅ Всегда доступно (встроено в письмо)
- ✅ Работает в VML для фонов

**Недостатки:**
- ❌ Увеличивает размер письма (~30-50% больше)
- ❌ Увеличивает размер HTML

### Реализация:

1. Читать файлы из `public/images/` во время генерации письма
2. Конвертировать в base64
3. Использовать в HTML как `data:image/png;base64,...`

### Пример использования:

```typescript
import fs from 'fs'
import path from 'path'

// Чтение и конвертация в base64
const backgroundImagePath = path.join(process.cwd(), 'public', 'images', 'zmiety arkusz papieru 2.png')
const logoImagePath = path.join(process.cwd(), 'public', 'images', 'Logo_Omobonus.png')

const backgroundBase64 = fs.readFileSync(backgroundImagePath).toString('base64')
const logoBase64 = fs.readFileSync(logoImagePath).toString('base64')

const backgroundDataUrl = `data:image/png;base64,${backgroundBase64}`
const logoDataUrl = `data:image/png;base64,${logoBase64}`
```

### В HTML:

```html
<!-- Фон -->
background-image: url('data:image/png;base64,iVBORw0KGgoAAAANS...');

<!-- VML для Outlook -->
<v:fill type="frame" src="data:image/png;base64,iVBORw0KGgoAAAANS..." color="transparent"/>

<!-- Логотип -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." alt="Logo" />
```

## 6. Альтернативное решение: CID attachments

Если размер письма критичен, можно использовать CID attachments:

```typescript
const attachments = [
  {
    filename: 'background.png',
    content: fs.readFileSync(backgroundImagePath),
    contentId: 'background',
    contentType: 'image/png',
  },
  {
    filename: 'logo.png',
    content: fs.readFileSync(logoImagePath),
    contentId: 'logo',
    contentType: 'image/png',
  },
]
```

```html
<!-- В HTML -->
<img src="cid:logo" />
```

Но для фоновых изображений это сложнее, поэтому base64 предпочтительнее.

## Выводы

1. **Текущая проблема:** Использование внешних URL, которые Outlook блокирует
2. **Решение:** Встроить изображения как base64 в HTML
3. **Реализация:** Читать файлы из `public/images/` и конвертировать в base64
4. **Результат:** Изображения будут работать в Outlook без блокировок


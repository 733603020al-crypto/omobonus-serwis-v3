// export-services.ts
// Регистрируем пути из tsconfig.json для поддержки алиасов
import 'tsconfig-paths/register'

import { services } from './src/lib/services-data'
import fs from 'fs'
import path from 'path'

// Функция для экранирования CSV значений
function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return ''
  const stringValue = String(value).trim()
  
  // Если пустая строка - возвращаем пустоту
  if (!stringValue) return ''
  
  // Заменяем переносы строк на пробелы для читаемости в Excel
  const cleaned = stringValue.replace(/\n/g, ' ').replace(/\r/g, '')
  
  // Если содержит точку с запятой, кавычки или перенос - обрамляем в кавычки
  if (cleaned.includes(';') || cleaned.includes('"') || cleaned.includes('\n')) {
    return `"${cleaned.replace(/"/g, '""')}"`
  }
  
  return cleaned
}

// Интерфейс для строки CSV
interface CSVRow {
  category: string        // Категория
  section: string        // Секция
  subcategory: string    // Подкатегория
  service: string        // Услуга
  description: string    // Описание
  price: string          // Цена
  duration: string       // Срок выполнения
  notes: string          // Примечания
  link: string           // Ссылка
}

// Функция для преобразования данных в плоскую структуру
function flattenServices(servicesData: typeof services): CSVRow[] {
  const rows: CSVRow[] = []
  
  servicesData.forEach(service => {
    const category = service.title || service.slug
    const categoryDescription = service.description || service.subtitle || ''
    const globalNotes = service.priceTooltip || ''
    
    service.pricingSections.forEach(section => {
      const sectionTitle = section.title || ''
      const sectionStatus = section.status || ''
      
      // Обработка обычных элементов секции (items)
      if (section.items && section.items.length > 0) {
        section.items.forEach(item => {
          rows.push({
            category: category,
            section: sectionTitle,
            subcategory: '',
            service: item.service || '',
            description: categoryDescription,
            price: item.price || '',
            duration: item.duration || '',
            notes: sectionStatus || globalNotes,
            link: item.link || ''
          })
        })
      }
      
      // Обработка подкатегорий
      if (section.subcategories && section.subcategories.length > 0) {
        section.subcategories.forEach(subcat => {
          const subcatTitle = subcat.title || ''
          const subcatDescription = subcat.subtitle || categoryDescription
          
          // Если есть элементы в подкатегории
          if (subcat.items && subcat.items.length > 0) {
            subcat.items.forEach(item => {
              rows.push({
                category: category,
                section: sectionTitle,
                subcategory: subcatTitle,
                service: item.service || '',
                description: subcatDescription,
                price: item.price || subcat.price || '',
                duration: item.duration || '',
                notes: sectionStatus || globalNotes,
                link: item.link || ''
              })
            })
          }
          // Если есть ответ (FAQ)
          else if (subcat.answer) {
            rows.push({
              category: category,
              section: sectionTitle,
              subcategory: subcatTitle,
              service: subcatTitle,
              description: subcat.answer.replace(/\n/g, ' '),
              price: '',
              duration: '',
              notes: '',
              link: ''
            })
          }
          // Если есть только цена в заголовке подкатегории (аренда)
          else if (subcat.price) {
            rows.push({
              category: category,
              section: sectionTitle,
              subcategory: subcatTitle,
              service: subcatTitle,
              description: subcatDescription,
              price: subcat.price,
              duration: '',
              notes: sectionStatus || globalNotes,
              link: ''
            })
          }
        })
      }
      
      // Если секция не имеет ни items, ни subcategories
      if ((!section.items || section.items.length === 0) && 
          (!section.subcategories || section.subcategories.length === 0)) {
        rows.push({
          category: category,
          section: sectionTitle,
          subcategory: '',
          service: sectionTitle,
          description: categoryDescription,
          price: sectionStatus || '',
          duration: '',
          notes: globalNotes,
          link: ''
        })
      }
    })
  })
  
  return rows
}

// Функция для преобразования строк в CSV формат
function rowsToCSV(rows: CSVRow[]): string {
  // Заголовки CSV (на русском)
  const headers = [
    'Категория',
    'Секция',
    'Подкатегория',
    'Услуга',
    'Описание',
    'Цена',
    'Срок выполнения',
    'Примечания',
    'Ссылка'
  ]
  
  // Создаём заголовок
  let csvContent = headers.map(h => escapeCSV(h)).join(';') + '\n'
  
  // Добавляем строки данных
  rows.forEach(row => {
    const rowData = [
      row.category,
      row.section,
      row.subcategory,
      row.service,
      row.description,
      row.price,
      row.duration,
      row.notes,
      row.link
    ]
    
    csvContent += rowData.map(field => escapeCSV(field)).join(';') + '\n'
  })
  
  return csvContent
}

// Основная функция
async function exportServices() {
  try {
    console.log('📊 Начинаю экспорт услуг...')
    
    // Преобразуем данные в плоскую структуру
    const flatRows = flattenServices(services)
    
    console.log(`✅ Обработано ${flatRows.length} строк данных`)
    
    // Преобразуем в CSV
    const csvContent = rowsToCSV(flatRows)
    
    // Сохраняем файл
    const outputPath = path.join(process.cwd(), 'services_export.csv')
    
    // Сохраняем с кодировкой UTF-8 (добавляем BOM для корректного отображения в Excel)
    fs.writeFileSync(outputPath, '\ufeff' + csvContent, 'utf-8')
    
    console.log(`✅ Файл сохранён: ${outputPath}`)
    console.log(`📋 Всего строк: ${flatRows.length}`)
    console.log(`📁 Полный путь: ${path.resolve(outputPath)}`)
    
  } catch (error) {
    console.error('❌ Ошибка при экспорте:', error)
    if (error instanceof Error) {
      console.error('Детали:', error.message)
      console.error('Стек:', error.stack)
    }
    process.exit(1)
  }
}

// Запускаем экспорт
exportServices()


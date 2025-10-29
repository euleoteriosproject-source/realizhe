BEGIN;

UPDATE public.produtos
SET descricao = '5 refeições com toque sofisticado | Equilíbrio, sabor e elegância',
    destaques = jsonb_build_array(
      'Frango recheado com ricota e espinafre + Legumes salteados no azeite e alho + purê de mandioquinha',
      'Parmegiana de carne ao molho artesanal + Arroz com brócolis + mix de legumes na manteiga',
      'Tilápia ao forno com crosta de castanhas + Purê de batata-doce + cenoura glaciada',
      'Risoto de carne moída (patinho) com cebola roxa e alho-poró, finalizado com ervas frescas e toque de azeite',
      'Frango pizzaiolo com gnudi de ricota e espinafre + Abobrinha grelhada e molho pomodoro artesanal'
    )
WHERE slug = 'box-essenzhe-gourmet'
   OR lower(nome) = 'box essenzhe gourmet';

UPDATE public.produtos
SET descricao = '7 refeições completas | Sem arroz | Rica em proteínas e vegetais',
    destaques = jsonb_build_array(
      'Frango grelhado com crosta de castanhas + Purê de couve-flor + vagem na manteiga',
      'Carne de panela desfiada ao molho roti + Mix de berinjela, abobrinha e tomate confit',
      'Almôndegas de frango com espaguete de abobrinha + Molho rústico de tomate com ervas',
      'Tilápia ao forno com crosta de ervas + Brócolis e couve-flor refogados + creme de abóbora',
      'Escondidinho de frango com purê de mandioquinha + Abobrinha grelhada',
      'Iscas de carne acebolada com legumes salteados + Mix de cenoura, vagem e alho-poró',
      'Frango ao molho mostarda com legumes assados no azeite'
    )
WHERE slug = 'box-essenzhe-low-carb'
   OR lower(nome) = 'box essenzhe low carb';

UPDATE public.produtos
SET descricao = '7 refeições completas | Prontas para aquecer | Sabor de comida feita com carinho',
    destaques = jsonb_build_array(
      'Frango grelhado com arroz integral e abobrinha + Mix de legumes no vapor (brócolis, cenoura e couve-flor)',
      'Escondidinho de carne de panela com purê de batata-doce + Couve-flor e cenoura salteadas no alho',
      'Tilápia assada ao limão com purê de mandioquinha + Mix de legumes salteados com vagem e cenoura',
      'Almôndegas de frango ao molho rústico de tomate + Arroz branco soltinho + mix de legumes na manteiga',
      'Carne moída com cebola roxa e arroz com cúrcuma + Brócolis e abobrinha grelhada',
      'Frango ao curry suave com arroz integral + Vagem no vapor e cenoura ao alho',
      'Macarrão integral ao molho de tomate e manjericão com iscas de carne'
    )
WHERE slug = 'box-essenzhe-classico'
   OR lower(nome) = 'box essenzhe clássico'
   OR lower(nome) = 'box essenzhe classico';

UPDATE public.produtos
SET descricao = '7 refeições equilibradas | Sem trigo e derivados do leite | Leves, naturais e saborosas',
    destaques = jsonb_build_array(
      'Frango grelhado com azeite de ervas + Purê de mandioquinha + brócolis no vapor',
      'Carne de panela desfiada ao molho roti + Mix de berinjela, abobrinha e tomate confit',
      'Tilápia ao limão com batata-doce rústica + Mix de legumes no vapor',
      'Frango desfiado ao molho de tomate caseiro + Espaguete de abobrinha + cenoura salteada',
      'Iscas de carne acebolada com vagem e abóbora grelhada + Arroz de couve-flor',
      'Escondidinho de frango com purê de batata-doce + Abobrinha e cenoura salteadas',
      'Risoto de legumes com quinoa, cenoura e brócolis + Iscas de frango grelhado'
    )
WHERE slug = 'box-essenzhe-sem-gluten-e-sem-lactose'
   OR lower(nome) = 'box essenzhe sem glúten e sem lactose'
   OR lower(nome) = 'box essenzhe sem gluten e sem lactose';

UPDATE public.produtos
SET descricao = 'Sopas sem glúten, sem laticínios e com proteína.',
    destaques = jsonb_build_array(
      'Batata com frango e alho-poró — Batata branca, frango desfiado, alho-poró e azeite',
      'Cenoura com gengibre e frango — Cenoura e batata branca batida, frango desfiado e gengibre fresco',
      'Verde com frango (espinafre e abobrinha) — Espinafre, abobrinha, batata branca, frango desfiado e ervas',
      'Mandioquinha, batata e carne moída magra — Mandioquinha cremosa, batata branca e carne moída magra refogada',
      'Rústica com carne (legumes variados) — Batata, cenoura, abobrinha, chuchu e carne moída com ervas naturais',
      'Caldo verde com frango — Batata branca, couve fininha, frango desfiado e alho dourado',
      'Beterraba com batata e carne moída — Beterraba batida com batata branca, carne refogada e cebola',
      'Inhame com batata e frango — Inhame batido com batata branca, frango desfiado e hortelã',
      'Alho assado com batata e carne — Batata branca com alho assado e carne moída com toque de pimenta'
    )
WHERE slug = 'cardapio-de-sopas-funcionais'
   OR lower(nome) = 'cardápio de sopas funcionais'
   OR lower(nome) = 'cardapio de sopas funcionais';

UPDATE public.produtos
SET descricao = 'Lanches leves, funcionais e deliciosos.',
    destaques = jsonb_build_array(
      'Frango com queijo muçarela — Peito de frango desfiado com ervas e muçarela derretida (130g | Proteico e saboroso)',
      'Atum com tomate e orégano — Atum leve com cubos de tomate fresco e toque aromático de orégano (130g | Fonte de ômega-3)',
      'Ricota com espinafre — Creme de ricota temperada com espinafre refogado no azeite (120g | Rica em cálcio)',
      'Banana com canela e chia — Banana amassada com canela e toque funcional de chia (120g | Energia natural e fibras)',
      'Maçã com pasta de amendoim — Maçã picada, canela e pasta integral de amendoim (130g | Lanche pré-treino ideal)'
    )
WHERE slug = 'cardapio-de-crepiocas-essenzhe'
   OR lower(nome) = 'cardápio de crepiocas essenzhe'
   OR lower(nome) = 'cardapio de crepiocas essenzhe';

COMMIT;
<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Article de blog SEO',
                'category' => 'article',
                'description' => 'Génère un article de blog optimisé SEO avec structure H2, méta-description et mots-clés.',
                'system_prompt' => 'Tu es un expert en rédaction SEO. Génère un article de blog structuré avec : un titre accrocheur, une méta-description (max 160 caractères), une introduction, des sections H2, des listes à puces, et une conclusion. Utilise un ton professionnel mais accessible. Inclus des mots-clés pertinents naturellement.',
                'variables' => json_encode([
                    ['name' => 'sujet', 'label' => 'Sujet de l\'article', 'type' => 'text'],
                    ['name' => 'ton', 'label' => 'Ton (professionnel, décontracté, technique)', 'type' => 'text'],
                    ['name' => 'public_cible', 'label' => 'Public cible', 'type' => 'text'],
                    ['name' => 'longueur', 'label' => 'Longueur (mots)', 'type' => 'number'],
                ]),
            ],
            [
                'name' => 'Email de prospection',
                'category' => 'email',
                'description' => 'Crée un email de prospection professionnel et convaincant.',
                'system_prompt' => 'Tu es un expert en copywriting commercial. Rédige un email de prospection professionnel et personnalisé. Structure : objet accrocheur, ligne d\'ouverture, présentation de valeur, preuve sociale optionnelle, appel à l\'action clair, signature professionnelle. Ton direct mais courtois.',
                'variables' => json_encode([
                    ['name' => 'nom_prospect', 'label' => 'Nom du prospect', 'type' => 'text'],
                    ['name' => 'entreprise', 'label' => 'Nom de l\'entreprise', 'type' => 'text'],
                    ['name' => 'valeur_proposition', 'label' => 'Proposition de valeur', 'type' => 'textarea'],
                    ['name' => 'objectif', 'label' => 'Objectif de l\'email', 'type' => 'text'],
                ]),
            ],
            [
                'name' => 'Post LinkedIn',
                'category' => 'social',
                'description' => 'Génère un post LinkedIn engageant pour développer votre réseau professionnel.',
                'system_prompt' => 'Tu es un stratège en contenu LinkedIn. Génère un post professionnel engageant avec : un accroche forte sur la première ligne (avant "voir plus"), un contenu à valeur ajoutée, des emojis discrets et pertinents, des hashtags stratégiques (3-5), et une question pour engager la discussion. Format texte court mais impactant.',
                'variables' => json_encode([
                    ['name' => 'sujet', 'label' => 'Sujet du post', 'type' => 'text'],
                    ['name' => 'expertise', 'label' => 'Domaine d\'expertise', 'type' => 'text'],
                    ['name' => 'objectif', 'label' => 'Objectif (notoriété, engagement, leads)', 'type' => 'text'],
                ]),
            ],
            [
                'name' => 'Post Twitter/X',
                'category' => 'social',
                'description' => 'Crée un tweet ou thread Twitter/X engageant et viral.',
                'system_prompt' => 'Tu es un expert en contenu Twitter/X. Génère un thread ou tweet avec : un hook puissant, des informations concises et percutantes, un fil conducteur logique, un call-to-action final. Maximum 280 caractères par tweet. Utilise un ton authentique et direct.',
                'variables' => json_encode([
                    ['name' => 'sujet', 'label' => 'Sujet', 'type' => 'text'],
                    ['name' => 'type', 'label' => 'Type (tweet simple ou thread)', 'type' => 'text'],
                    ['name' => 'ton', 'label' => 'Ton (humoristique, sérieux, technique)', 'type' => 'text'],
                ]),
            ],
            [
                'name' => 'Description produit',
                'category' => 'article',
                'description' => 'Rédige une description produit persuasive et optimisée conversion.',
                'system_prompt' => 'Tu es un copywriter e-commerce expert. Rédige une description produit convaincante avec : un titre accrocheur, les bénéfices clés, les caractéristiques techniques, la preuve sociale, et un appel à l\'action. Utilise la méthode AIDA (Attention, Intérêt, Désir, Action). Ton persuasif mais authentique.',
                'variables' => json_encode([
                    ['name' => 'nom_produit', 'label' => 'Nom du produit', 'type' => 'text'],
                    ['name' => 'caracteristiques', 'label' => 'Caractéristiques principales', 'type' => 'textarea'],
                    ['name' => 'public_cible', 'label' => 'Public cible', 'type' => 'text'],
                    ['name' => 'prix', 'label' => 'Prix', 'type' => 'text'],
                ]),
            ],
            [
                'name' => 'Email de relance',
                'category' => 'email',
                'description' => 'Crée un email de relance efficace pour convertir les prospects hésitants.',
                'system_prompt' => 'Tu es un expert en email marketing et conversion. Rédige un email de relance professionnel qui : rappelle la valeur sans être insistant, ajoute une nouvelle information ou raison de passer à l\'action, crée un sentiment d\'urgence ou de rareté si pertinent, et propose une aide personnalisée. Ton amical mais professionnel.',
                'variables' => json_encode([
                    ['name' => 'nom_prospect', 'label' => 'Nom du prospect', 'type' => 'text'],
                    ['name' => 'contexte', 'label' => 'Contexte de la relance', 'type' => 'textarea'],
                    ['name' => 'offre', 'label' => 'Offre / valeur ajoutée', 'type' => 'text'],
                    ['name' => 'delai', 'label' => 'Délai / Urgence', 'type' => 'text'],
                ]),
            ],
            [
                'name' => 'Résumé exécutif',
                'category' => 'article',
                'description' => 'Génère un résumé exécutif structuré pour des rapports ou présentations.',
                'system_prompt' => 'Tu es un consultant en stratégie. Rédige un résumé exécutif professionnel structuré en : contexte et enjeux, analyse synthétique, recommandations clés, et prochaines étapes. Format clair et concis avec des données chiffrées si pertinent. Ton formel et autoritaire.',
                'variables' => json_encode([
                    ['name' => 'sujet', 'label' => 'Sujet du rapport', 'type' => 'text'],
                    ['name' => 'contexte', 'label' => 'Contexte', 'type' => 'textarea'],
                    ['name' => 'points_cles', 'label' => 'Points clés à inclure', 'type' => 'textarea'],
                    ['name' => 'audience', 'label' => 'Audience cible', 'type' => 'text'],
                ]),
            ],
            [
                'name' => 'Biographie professionnelle',
                'category' => 'custom',
                'description' => 'Crée une biographie professionnelle percutante pour votre site, réseau ou conférence.',
                'system_prompt' => 'Tu es un rédacteur de biographies professionnelles. Crée une bio percutante et authentique incluant : une accroche qui capture l\'essence de la personne, son parcours professionnel clé, ses réalisations marquantes, sa proposition de valeur unique, et une touche personnelle. 3 versions : courte (50 mots), moyenne (150 mots), longue (300 mots).',
                'variables' => json_encode([
                    ['name' => 'nom', 'label' => 'Nom complet', 'type' => 'text'],
                    ['name' => 'poste', 'label' => 'Poste actuel', 'type' => 'text'],
                    ['name' => 'parcours', 'label' => 'Parcours professionnel', 'type' => 'textarea'],
                    ['name' => 'realisations', 'label' => 'Réalisations clés', 'type' => 'textarea'],
                    ['name' => 'objectif', 'label' => 'Objectif de la bio', 'type' => 'text'],
                ]),
            ],
        ];

        foreach ($templates as $template) {
            Template::create(array_merge($template, [
                'id' => Str::uuid(),
                'is_public' => true,
            ]));
        }
    }
}
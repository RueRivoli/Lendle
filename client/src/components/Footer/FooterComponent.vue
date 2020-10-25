<template>
<footer :class="position" style="background-color: #cfccc4;width:100%;padding: 7px;bottom:0;display:flex;height: 14vh;">
    <div class="margin-auto" style="width:30vh;margin:auto;">
        <el-row class="line-H">
            <span class="lendle" style="line-height:40px;font-size:40px;color:black;">Lendle</span>
        </el-row>
        <el-row class="line-H" style="font-size:14px;color:black;">
            Locations de meubles entre particuliers
        </el-row>
        <el-row class="line-H">
            <span>© Lendle</span>
        </el-row>
    </div>
    <el-main style="font-size:12px;margin:auto;">
        <el-row>
            <el-col :span="6" :offset="1">
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/" tag="span">Accueil</router-link>
                    </span>
                </el-row>
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/intro/beARenter" tag="span">Comment louer des meubles</router-link>
                    </span>
                </el-row>
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/intro/beARenter" tag="span">Comment mettre en location</router-link>
                    </span>
                </el-row>
            </el-col>
            <el-col :span="6">
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/search" tag="span">Chercher des meubles</router-link>
                    </span>
                </el-row>
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/profile" tag="span">Mon compte</router-link>
                    </span>
                </el-row>
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/login" tag="span">Se connecter</router-link>
                    </span>
                </el-row>
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/signup/loaner" tag="span">S'inscrire pour louer</router-link>
                    </span>
                </el-row>
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/signup/renter" tag="span">S'inscrire pour mettre en location</router-link>
                    </span>
                </el-row>
            </el-col>
            <el-col :span="6">
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/help" tag="span">Aide</router-link>
                    </span>
                </el-row>
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/conditionsutilisation" tag="span">Conditions d'utilisation</router-link>
                    </span>
                </el-row>
                <el-row class="line-h">
                    <span class="pointer">
                        <router-link to="/help" tag="span">Contact</router-link>
                    </span>
                </el-row>
            </el-col>
            <el-col class="horizontal" :span="5">
                <el-row style="text-align:center;margin-top:15px;">
                    <img class="pointer" src="../../assets/instagram_black.svg" alt="" style="width:35px;margin-right:10px;">
                    <img class="pointer" src="../../assets/twitter.svg" alt="" style="width:35px;margin-right:10px;">
                    <img class="pointer" src="../../assets/facebook_black.svg" alt="" style="width:35px;">
                </el-row>
            </el-col>
             <el-col class="vertical" :span="5">
                <div class="flex" style="flex-direction:column;align-items:center;">
                    <img class="pointer" src="../../assets/instagram_black.svg" alt="" style="width:35px;margin-bottom:5px;">
                    <img class="pointer" src="../../assets/twitter.svg" alt="" style="width:35px;margin-bottom:5px;">
                    <img class="pointer" src="../../assets/facebook_black.svg" alt="" style="width:35px;margin-bottom:5px;">
                </div>
            </el-col>
        </el-row>
    </el-main>
</footer>
</template>

<script>

export default {
    name: 'FooterComponent',
    props: {
        position: String
    },
    data() {
        return {}
    },
    methods: {}
}
</script>

<style scoped>
.hovering:hover {
    color: white !important;
    opacity: 0.9;
}

.line-H {
    line-height: 25px;
}

.line-h {
    line-height: 18px;
}

.relative{
    position: relative !important;
}

.absolute{
    position: absolute !important;
}

.el-main {
    padding: 0;
}

ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: 0;
    height: 50px;
    line-height: 50px;
    white-space: nowrap;
    /* interdiction de passer à la ligne */
}

li {
    list-style: none;
    cursor: pointer;
    position: relative;
    font-size: 14px;
}


@media screen and (max-width: 900px) {
    .horizontal{
        display:none;
    }
}

@media screen and (min-width: 900px) {
    .vertical{
        display:none;
    }
}

</style>
